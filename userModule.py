import hashlib
from os import remove, listdir, path, makedirs
from typing import List, Tuple, Dict
import ch2
import platform


# Immediate installation - Works in
basepath = './'
if ch2.ch_data('$DEV_MODE', './consts.ch') != 1:
	if platform.system() =='Linux':
		basepath= path.expanduser("~")+"/.gc_programms/tk/tm/"
	else:
		basepath="C:/GC_PROGRAMMS/tk/tm/"

def getConfig(configName, defaultValue=''):
	configValue = ch2.ch_data(configName, 'consts.ch', alt=defaultValue)
	if '~' in configValue:
		configValue = configValue.replace('~', basepath[:-1])
	return configValue

def getDataDir():
	return getConfig('$TM_DATA_DIR', './data')

def getLogsDir():
	return getConfig('$TM_LOGS_DIR', './logs')

# Create needed directories
if not path.exists(basepath):
    makedirs(basepath+'data/migrations')
    makedirs(basepath+'logs')

# Checks if a version is higher than another
def isHigherVersion(current, other):
	cn = current.split(".")
	on = other.split(".")
	for i in range(4):
		if on[i] == cn[i]:
			pass
		else:
			return int(on[i]) > int(cn[i])
	return False

# Performs migrations
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

# Fonction pour transformer un tuple en dictionnaire
def tuple_to_dict(tpl: Tuple, names: Tuple[str]) -> Dict[str, any]:
    if len(tpl) != len(names):
        raise ValueError("Le nombre d'éléments dans le tuple et les noms doit être identique")
    
    return {names[i]: tpl[i] for i in range(len(tpl))}

# Fonction pour transformer une liste de tuples en liste de dictionnaires
def list_to_dict(lst: List[Tuple], names: Tuple[str]) -> List[Dict[str, any]]:
    return [tuple_to_dict(el, names) for el in lst]


def hasRight(right: str, rights: list):
    rnames = {r['name'] for r in rights}
    return 'admin' in rnames or right in rnames

def delete_file(path: str):
	full_path = 'uploads/'+path
	remove(full_path)

# Performs migrations
def run_sql_query_with_filters(dbObject, params, filters):
	has_filter = False
	for el in filters:
		if filters[el] is True:
			has_filter = True
	filter_str = ', '.join(el for el in filters if filters[el] is True)
	filter_part = f' AND p.status IN ({filter_str}) ' if has_filter else ''
	query = f"""
			SELECT
				id, name, description, creator, status,
				start_date, end_date, effective_start, effective_end,
				parent, category_id, create_date, active
			FROM project p
			WHERE p.active = 1
			AND EXISTS (
				SELECT 1
				FROM user_project up
				WHERE up.project_id = p.id
				AND up.user_id = ?
			)
			{filter_part}
			LIMIT 20 OFFSET ?;
			"""
	try:
		dbObject.cursor.execute(query, (params[0], params[1]))
	except Exception as e:
		return []
	return dbObject.cursor.fetchall()

def run_sql_query_with_filters_for_tasks(dbObject, params, filters):
	has_filter = False
	for el in filters:
		if filters[el] is True:
			has_filter = True
	filter_str = ', '.join(el for el in filters if filters[el] is True)
	filter_part = f' AND p.status IN ({filter_str}) ' if has_filter else ''

	query = f"""
			SELECT
				p.id, p.name, p.description, p.creator, p.status,
				p.project_id, p.category_id, p.create_date, p.active
			FROM task p
			WHERE p.active = 1
			AND EXISTS (
				SELECT 1
				FROM user_task ut
				WHERE ut.task_id = p.id
				AND ut.user_id = ?
			)
			{filter_part}
			LIMIT 20 OFFSET ?;
			"""
	print(query)
	try:
		dbObject.cursor.execute(query, (params[0], params[1]))
	except Exception as e:
		print(str(e))
		return []
	return dbObject.cursor.fetchall()
