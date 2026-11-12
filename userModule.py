import hashlib
from os import remove, listdir, path, makedirs
from typing import List, Tuple, Dict
import ch2
import platform

import json
import os
import sys
import asyncio

try:
	from telethon import TelegramClient, errors
except ImportError:
	TelegramClient = None
	errors = None


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


# ---------------------------------------------------------------------------
# Telegram notification helpers
# ---------------------------------------------------------------------------

_TG_CLIENT = None


def _get_tg_client():
	global _TG_CLIENT
	if _TG_CLIENT is not None:
		return _TG_CLIENT

	if TelegramClient is None:
		raise RuntimeError("telethon is not installed in this environment")

	config = load_tg_config()
	_TG_CLIENT = TelegramClient(
		"tm_session",
		config["api_id"],
		config["api_hash"],
	)
	_TG_CLIENT._tm_config = config
	return _TG_CLIENT


def load_tg_config(config_path="config.json"):
	if not os.path.exists(config_path):
		raise FileNotFoundError("Telegram config file 'config.json' not found")

	with open(config_path, "r") as f:
		config = json.load(f)

	for key in ("api_id", "api_hash", "phone"):
		if not config.get(key):
			raise ValueError(f"Telegram config is missing or empty: '{key}'")

	phone = config["phone"]
	if not phone.startswith("+"):
		config["phone"] = "+" + phone

	return config


def send_telegram_message(arg_contacts_list, arg_message_content):
	"""Send *arg_message_content* to every phone in *arg_contacts_list*.

	Parameters
	----------
	arg_contacts_list : str
	    Comma-separated phone numbers, e.g. "+1234567890, +1234567891"
	arg_message_content : str
	    The text message to send.
	"""
	phones = []
	for part in str(arg_contacts_list).split(","):
		p = part.strip()
		if p:
			if not p.startswith("+"):
				p = "+" + p
			phones.append(p)

	if not phones:
		return {"sent": 0, "failed": 0, "errors": ["No valid phone numbers provided"]}

	if not arg_message_content or not str(arg_message_content).strip():
		return {"sent": 0, "failed": 0, "errors": ["Message content is empty"]}

	message = str(arg_message_content)

	client = _get_tg_client()
	config = getattr(client, '_tm_config', None)

	async def _run():
		start_kwargs = {}
		code = config.get("code") if config else None
		if code:
			start_kwargs["code"] = code
		if code:
			start_kwargs["phone"] = config["phone"]
		await client.start(**start_kwargs)
		success = 0
		failures = 0
		err_msgs = []

		for phone in phones:
			try:
				entity = await client.get_entity(phone)
				await client.send_message(entity, message)
				success += 1
			except Exception as exc:
				failures += 1
				err_msgs.append(f"{phone}: {exc}")

		await client.disconnect()
		return {"sent": success, "failed": failures, "errors": err_msgs}

	try:
		loop = asyncio.get_event_loop()
		if loop.is_closed():
			loop = asyncio.new_event_loop()
			asyncio.set_event_loop(loop)
	except RuntimeError:
		loop = asyncio.new_event_loop()
		asyncio.set_event_loop(loop)

	return loop.run_until_complete(_run())


def notify(arg_contacts_list, arg_message_content):
	"""Public wrapper — returns the result dict from send_telegram_message."""
	return send_telegram_message(arg_contacts_list, arg_message_content)
