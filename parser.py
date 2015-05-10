import ujson
import sqlite3
from datetime import datetime
from pprint import pprint

def GetData(table_name):
    conn = sqlite3.connect('participants.db')
    cursor = conn.execute("SELECT datastring FROM " + table_name)
    data = []
    for row in cursor:
        if row[0] == None:
            continue
        s = ujson.loads(ujson.dumps(row[0]))
        data.append(s)
    return data

def ParseOne(datarow, taskID):
    assignmentID = taskID
    gender = datarow['questiondata']['gender']
    age = datarow['questiondata']['age']
    demographic = datarow['questiondata']['demographic']
    handedness = datarow['questiondata']['handedness']
    starttime = datetime.fromtimestamp(
        int(datarow['data'][0]['dateTime']/1000)
    ).strftime('%Y-%m-%d %H:%M:%S')

    triplets = []
    doublets = []
    for i in range(0, len(datarow['data'])):
        if datarow['data'][i]['trialdata']['phase'] == 'Triplet1':
            triplets.append(datarow['data'][i]['trialdata'])
        if datarow['data'][i]['trialdata']['phase'] == 'Doublet':
            doublets.append(datarow['data'][i]['trialdata'])
        if datarow['data'][i]['trialdata']['phase'] == 'Triplet2':
            triplets.append(datarow['data'][i]['trialdata'])

    tripletsdata = []
    for i in range(0, len(triplets)):
        arr = []
        arr.append(str(triplets[i]['topimg']\
            .split('/static/images/EclipseFace/')[1].split('.png')[0]))
        arr.append(str(triplets[i]['leftimg']\
            .split('/static/images/EclipseFace/')[1].split('.png')[0]))
        arr.append(str(triplets[i]['rightimg']\
            .split('/static/images/EclipseFace/')[1].split('.png')[0]))
        arr.append(str(triplets[i]['response']))
        arr.append(str(triplets[i]['reacttime']))

        arr.append(assignmentID)
        arr.append(str(gender))
        arr.append(str(age))
        arr.append(str(demographic))
        arr.append(str(handedness))
        arr.append(starttime)
        if triplets[i]['phase'] == 'Triplet1':
            arr.append('Triplet1')
        if triplets[i]['phase'] == 'Triplet2':
            arr.append('Triplet2')

        tripletsdata.append(arr)

    doubletsdata = []
    for i in range(0, len(doublets)):
        arr = []
        arr.append(str(doublets[i]['leftimg']\
            .split('/static/images/EclipseFace/')[1].split('.png')[0]))
        arr.append(str(doublets[i]['rightimg']\
            .split('/static/images/EclipseFace/')[1].split('.png')[0]))
        arr.append(str(doublets[i]['response']))
        arr.append(str(doublets[i]['reacttime']))

        arr.append(assignmentID)
        arr.append(str(gender))
        arr.append(str(age))
        arr.append(str(demographic))
        arr.append(str(handedness))
        arr.append(starttime)
        
        doubletsdata.append(arr)

    return [tripletsdata, doubletsdata]

def writeListToFile(theList, fileName):
    with open(fileName, "w") as ins:
        for item in theList:
            ins.write(str(item) + '\n')

if __name__=='__main__':
    #data = ujson.dumps(f.read())
    data = GetData('turkdemo')
    tripletsdata = []
    doubletsdata = []
    taskID = 1
    for row in data:
        datarow = ujson.loads(row)
        tup = ParseOne(datarow, taskID)
        for item in tup[0]:
            tripletsdata.append(item)
        for item in tup[1]:
            doubletsdata.append(item)
        # tripletsdata.extend(tup[0])
        # doubletsdata.extend(tup[1])
        taskID = taskID + 1

    writeListToFile(tripletsdata, 'output/triplets.txt')
    writeListToFile(doubletsdata, 'output/doublets.txt')







