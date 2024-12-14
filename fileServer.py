import os
import io
import uuid
from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
import time
import ch2


UPLOAD_DIR = ch2.ch_data('$DATA_DIR', 'consts.ch')+'/tmp'

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class FileServerHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Gère l'upload de fichier."""
        if self.path == '/upload':
            content_type = self.headers.get('Content-Type')
            boundary = content_type.split('=')[-1] if 'boundary' in content_type else None

            if boundary:
                length = int(self.headers['Content-Length'])
                raw_body = self.rfile.read(length)

                file_data, filename = self.parse_multipart(raw_body, boundary)

                if file_data:
                    file_path = os.path.join(UPLOAD_DIR, filename)
                    with open(file_path, 'wb') as f:
                        f.write(file_data)

                    self.send_response(200)
                    self.send_header("Content-type", "text/html")
                    self.end_headers()
                    self.wfile.write(bytes(f"{file_path}", "utf-8"))
                else:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b"Error: No file uploaded.")
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"Error: Invalid content type.")
        
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Error: Invalid path.")

    def parse_multipart(self, raw_body, boundary):
        """Parser du multipart/form-data"""
        parts = raw_body.split(b'--' + boundary.encode())
        for part in parts:
            if not part or part == b'--\r\n':
                continue

            headers_end = part.find(b'\r\n\r\n')
            headers = part[:headers_end].decode(errors='ignore')
            content_disposition = next((line for line in headers.split('\r\n') if 'Content-Disposition' in line), None)
            if content_disposition:
                filename_start = content_disposition.find('filename="') + len('filename="')
                filename_end = content_disposition.find('"', filename_start)
                filename = content_disposition[filename_start:filename_end]

                file_data = part[headers_end + 4:].strip()
                return file_data, filename
        return None, None

    def do_GET(self):
        if self.path.startswith('/download/'):
            file_path = self.path[len('/download/'):].replace('%20', ' ')

            if os.path.exists(file_path):
                self.send_response(200)
                self.send_header("Content-type", "application/octet-stream")
                self.send_header("Content-Disposition", f"attachment; filename={file_path}")
                self.end_headers()

                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"Error: File not found.")
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Error: Invalid path.")

def run(server_class=HTTPServer, handler_class=FileServerHandler, port=6103):
    """Démarre le serveur HTTP dans un thread séparé."""
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on port {port}...")
    
    # Démarre le serveur dans un thread séparé pour ne pas bloquer l'exécution du programme
    thread = threading.Thread(target=httpd.serve_forever)
    thread.daemon = True  # Le serveur se termine quand le programme principal se termine
    thread.start()

    return httpd  # Retourner l'instance du serveur pour pouvoir l'arrêter plus tard
