import ujson
import os
import sqlite3

def GetData():
	conn = sqlite3.connect('participants.db')
	cursor = conn.execute("SELECT datastring FROM turkdemo")
	data = []
	for row in cursor:
		if row[0] == None:
			continue
		s = ujson.loads(ujson.loads(ujson.dumps(row[0])))
		data.append(s)
	return data

if __name__=='__main__':
	data = GetData()
	