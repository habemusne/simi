import ujson
import sqlite3
from datetime import datettime

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

def ParseOne(datarow):
    assignmentID = datarow['assignmentId']
    gender = datarow['questiondata']['gender']
    age = datarow['questiondata']['age']
    demographic = datarow['questiondata']['demographic']
    handedness = datarow['questiondata']['handedness']
    starttime = datetime.fromtimestamp(
        int(datarow['data'][0]['datatime'])
    ).strftime('%Y-%m-%d %H:%M:%S')

    triplet1s = []
    doublets = []
    triplet2s = []
    for i in range(0, len(datarow['data'])):
        if datarow['data'][i]['trialdata']['phase'] == 'Triplet1':
            triplet1s.append(datarow['data'][i]['trialdata'])
        if datarow['data'][i]['trialdata']['phase'] == 'Doublets':
            doublets.append(datarow['data'][i]['trialdata'])
        if datarow['data'][i]['trialdata']['phase'] == 'Triplet2':
            triplet2s.append(datarow['data'][i]['trialdata'])

    triplet1sdata = []
    for i in range(0, len(triplet1s)):
        arr = []
        arr.append(triplet1s[i]['topimg']\
            .split('/static/images/EclipseFace/')[1].split('.png')[0])
        arr.append(triplet1s[i]['leftimg']\
            .split('/static/images/EclipseFace/')[1].split('.png')[0])
        arr.append(triplet1s[i]['rightimg']\
            .split('/static/images/EclipseFace/')[1].split('.png')[0])
        arr.append(triplet1s[i]['response'])
        arr.append(triplet1s[i]['reacttime'])

        arr.append(assignmentID)
        arr.append(gender)
        arr.append(age)
        arr.append(demographic)
        arr.append(handedness)
        arr.append(starttime)

        triplet1sdata.append(arr)

    doubletsdata = []
    for i in range(0, len(doublets)):
        arr = []
        arr.append(doublets[i]['leftimg']\
            .split('/static/images/EclipseFace/')[1].split('.png')[0])
        arr.append(doublets[i]['rightimg']\
            .split('/static/images/EclipseFace/')[1].split('.png')[0])
        arr.append(doublets[i]['response'])
        arr.append(doublets[i]['reacttime'])

        arr.append(assignmentID)
        arr.append(gender)
        arr.append(age)
        arr.append(demographic)
        arr.append(handedness)
        arr.append(starttime)
        
        doubletsdata.append(arr)

    triplet2sdata = []
    for i in range(0, len(triplet2s)):
        arr = []
        arr.append(triplet2s[i]['topimg']\
            .split('/static/images/EclipseFace/')[1].split('.png')[0])
        arr.append(triplet2s[i]['leftimg']\
            .split('/static/images/EclipseFace/')[1].split('.png')[0])
        arr.append(triplet2s[i]['rightimg']\
            .split('/static/images/EclipseFace/')[1].split('.png')[0])
        arr.append(triplet2s[i]['response'])
        arr.append(triplet2s[i]['reacttime'])

        arr.append(assignmentID)
        arr.append(gender)
        arr.append(age)
        arr.append(demographic)
        arr.append(handedness)
        arr.append(starttime)
        
        triplet2sdata.append(arr)

    return [triplet1sdata, doubletsdata, triplet2sdata]

if __name__=='__main__':
    #data = ujson.dumps(f.read())
    data = GetData('turkdemo')
    triplet1sdata = []
    doubletsdata = []
    triplet2sdata = []
    for datarow in data:
        tup = ParseOne(datarow)
        triplet1sdata.append(tup[0])
        doubletsdata.append(tup[1])
        triplet2sdata.append(tup[2])
    print triplet1sdata









