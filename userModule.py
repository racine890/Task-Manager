import hashlib
from shutil import copy
from os import remove, listdir, path, makedirs
from fileServer import run as run_file_server, UPLOAD_DIR, getConfig, basepath

if not path.exists(basepath):
    makedirs(basepath+'data/tmp')
    makedirs(basepath+'data/migrations')
    makedirs(basepath+'logs')

def persistFile(filePath, folder="profiles"):
	if filePath.startswith(getConfig('$DATA_DIR')+'/tmp/'):
		filename = filePath[9:]
		newName = getConfig('$DATA_DIR')+"/"+folder+"/"+filename
		copy(filePath, newName)
		remove(filePath)
		return newName

def isHigherVersion(current, other):
	cn = current.split(".")
	on = other.split(".")
	for i in range(4):
		if on[i] == cn[i]:
			pass
		else:
			return int(on[i]) > int(cn[i])
	return False

# Get the migration files
def migrate(currentVersion, dbObject, repChar='?'):
	isPerfect = True
	availables = listdir(getConfig('$DATA_DIR')+"/migrations")
	if len(availables) == 0:
		return isPerfect

	logs = "Started migrations ...\n\n"
	
	for migration in availables:
		migration_code = migration[:migration.rindex('.')]
		if isHigherVersion(currentVersion, migration_code):
			logs+="\nPerforming migration : "+migration_code+"\n"

			mf = open(getConfig('$DATA_DIR')+"/migrations/"+migration, 'r')
			queries = mf.readlines()
			mf.close

			for query in queries:
				if query.strip() != '' and not query.strip().startswith('--'):
					try:
						dbObject.cursor.execute(query)
						logs+="\tSuccessfully executed : "+query+"\n"
						dbObject.cursor.execute("commit;")
					except Exception as e:
						logs+="\tAn error occured : "+str(e)+"\n"
						isPerfect = False
			dbObject.cursor.execute(f"update config set value = {repChar} where key = 'db_version'", (migration_code,))
	
	logs_file = open(getConfig('$LOGS_DIR')+"/migrations.log.txt", "w")
	logs_file.write(logs)
	logs_file.close()

	return isPerfect