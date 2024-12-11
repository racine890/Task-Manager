import hashlib
from shutil import copy
from os import remove, listdir
from fileServer import run as run_file_server

def persistFile(filePath, folder="profiles"):
	if filePath.startswith('data/tmp/'):
		filename = filePath[9:]
		newName = "data/"+folder+"/"+filename
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
	availables = listdir("./data/migrations")
	if len(availables) == 0:
		return isPerfect

	logs = "Started migrations ...\n\n"
	
	for migration in availables:
		migration_code = migration[:migration.rindex('.')]
		if isHigherVersion(currentVersion, migration_code):
			logs+="\nPerforming migration : "+migration_code+"\n"

			mf = open("./data/migrations/"+migration, 'r')
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
	
	logs_file = open("./logs/migrations.log.txt", "w")
	logs_file.write(logs)
	logs_file.close()

	return isPerfect