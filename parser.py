import ujson
import sqlite3
import os
import scipy.io
import sys

def get_database_data(db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.execute("SELECT datastring FROM turkdemo")
    data = []
    for row in cursor:
        if row[0] == None:
            continue
        s = ujson.loads(ujson.loads(ujson.dumps(row[0])))
        data.append(s)
    return data

def get_subject_data(raw_json):
    subject = {}
    subject['assignmentId'] = raw_json['assignmentId']
    subject['workerId'] = raw_json['workerId']
    subject['hitId'] = raw_json['hitId']
    for entry in raw_json['data']:
        if 'survey_new' in entry['trialdata']['trial_type']:
            ans = ujson.loads(entry['trialdata']['answer'])
            for field in ans:
                subject[field] = ans[field]
            break
    return subject

def get_triplet_data(raw_json):
    triplets = []
    for entry in raw_json['data']:
        if 'custom_triplet' in entry['trialdata']['trial_type']:
            triplet = {}
            triplet['stimuli'] = ujson.loads(entry['trialdata']['stimulus'])
            triplet['stimuli'][1] = triplet['stimuli'][1][24:-4]
            triplet['stimuli'][0] = triplet['stimuli'][0][24:-4]
            triplet['stimuli'][2] = triplet['stimuli'][2][24:-4]
            triplet['pressed'] = ujson.loads(entry['trialdata']['pressed'])
            triplet['pressed'][1] = triplet['pressed'][1][24:-4]
            triplet['pressed'][0] = triplet['pressed'][0][24:-4]
            triplet['react_time'] = entry['trialdata']['rt']
            triplet['trial_index_global'] = entry['trialdata']['trial_index_global']
            if (int(triplet['trial_index_global']) == 5):
                triplet['type'] = '0'
            elif (int(triplet['trial_index_global']) <12):
                triplet['type'] = '1'
            elif (triplet['stimuli'][1] == triplet['stimuli'][0]):
                triplet['type'] = '3'
            else:
                triplet['type'] = '2'
            triplets.append(triplet)
    return triplets

def get_doublet_data(raw_json):
    doublets = []    
    for entry in raw_json['data']:
        if 'similarity' in entry['trialdata']['trial_type']:
            doublet = {}
            doublet['stimuli'] = ujson.loads(entry['trialdata']['stimulus'])
            doublet['stimuli'][1] = doublet['stimuli'][1][24:-4]
            doublet['stimuli'][0] = doublet['stimuli'][0][24:-4]
            if (doublet['stimuli'][1] == doublet['stimuli'][0]):
                doublet['score'] = entry['trialdata']['catchy_answer']
                if (len(doublet['score'])< 1):
                    doublet['score'] = 'false'
                else:
                    doublet['score'] = 'true'
            else:
                doublet['score'] = entry['trialdata']['sim_score'][0]
            doublet['react_time'] = entry['trialdata']['rt']
            doublet['trial_index_global'] = entry['trialdata']['trial_index_global']
            if (int(doublet['trial_index_global']) == 5):
                doublet['type'] = '0'
            elif (int(doublet['trial_index_global']) <12):
                doublet['type'] = '1'
            elif (doublet['stimuli'][1] == doublet['stimuli'][0]):
                doublet['type'] = '3'
            else:
                doublet['type'] = '2'
            doublets.append(doublet)
    return doublets

def parse(raw_json):
    subject_data = get_subject_data(raw_json)
    triplet_data = get_triplet_data(raw_json)
    doublet_data = get_doublet_data(raw_json)
    combined_data = {}
    combined_data['subject_data'] = subject_data
    combined_data['triplet_data'] = triplet_data
    combined_data['doublet_data'] = doublet_data
    return combined_data

if __name__=='__main__':

    raw_jsons = get_database_data(sys.argv[1])
    if not os.path.exists('experiment_data'):
        os.makedirs('experiment_data')
    workerCounter = 1
    output_file_name_with_path = 'experiment_data/'
    with open(output_file_name_with_path +'subjectData.csv', 'w') as f:
        f.write('workerCounter,assignmentId,workerId,hitId,age,gender,sexual orientation,race,community \n')
    with open(output_file_name_with_path + 'doublet.csv', 'w') as f:
        f.write('workerCounter,assignmentId,workerId,hitId,trial type,reaction time,score,stimulus1,stimulus2 \n')
    '''
    with open(output_file_name_with_path + 'triplet.csv', 'w') as f:
        f.write('workerCounter,assignmentId,workerId,hitId,trial type,reaction time,pressed,stimulus1,stimulus2,stimulus3  \n')
    '''
    for raw_json in raw_jsons:
        data = parse(raw_json)
        #output_folder_name = str(workerCounter)
        with open(output_file_name_with_path + 'doublet.csv', 'a') as f:
            for entry in data['doublet_data']:
                f.write(str(workerCounter) + ',' + str(data['subject_data']['assignmentId']) + ',' +\
                        str(data['subject_data']['workerId']) + ',' +\
                        str(data['subject_data']['hitId']) + ',' + str(entry['type']) + ',' + str(entry['react_time']) +\
                    ',' + str(entry['score']) + ',')
                concat_str = ""
                for stimulus in entry['stimuli']:
                    concat_str += str(stimulus) + ','
                f.write(concat_str[:-1] + '\n')
        '''
        with open(output_file_name_with_path + 'triplet.csv', 'a') as f:
            for entry in data['triplet_data']:
                f.write(str(workerCounter) + ',' + str(data['subject_data']['assignmentId']) + ',' +\
                       str(data['subject_data']['workerId']) + ',' +\
                       str(data['subject_data']['hitId']) + ',' + str(entry['type']) + ',' + str(entry['react_time']) + ',')
                for pressed_image in entry['pressed']:
                    f.write(str(pressed_image) + ',')
                concat_str = ""
                for stimulus in entry['stimuli']:
                    concat_str += str(stimulus) + ','
                f.write(concat_str[:-1] + '\n')
        '''
        with open('experiment_data/subjectData.csv', 'a') as f:
            f.write(str(workerCounter) + ',' + str(data['subject_data']['assignmentId']) + ',' +\
                    str(data['subject_data']['workerId']) + ',' +\
                    str(data['subject_data']['hitId']) + ',' +\
                    str(data['subject_data']['age']) + ',' +\
                    str(data['subject_data']['gender'][0]) + ',' +\
                    str(data['subject_data']['sexOri'][0]) + ',')
            concat_str = ""
            for item in data['subject_data']['race']:
                concat_str += str(item) + ' '
            f.write(concat_str[:-1] + ',')
            concat_str = ""
            for item in data['subject_data']['comRace']:
                concat_str += str(item) + ' '
            f.write(concat_str[:-1] + '\n')
        workerCounter += 1

    print 'Done'
    # haha = scipy.io.loadmat('experiment_data/debugX308O0_debugMNSB5X_debug7M6X1D.mat')
    # print haha['doublet_data']








