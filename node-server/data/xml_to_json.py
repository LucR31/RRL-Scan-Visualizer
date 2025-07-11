import json
import xmltodict
import os



dir_json = './json_files/'
dir_xml = './xml_files/'

def write_json(file_name):
    with open(dir_xml+file_name + ".xml") as xml_file:
        data_dict = xmltodict.parse(xml_file.read())
        xml_file.close()
        json_data = json.dumps(data_dict)
        with open(dir_json+file_name + ".json", "w") as json_file:
            json_file.write(json_data)
            json_file.close()

names_json = [i[:-5] for i in os.listdir(dir_json)]
names_xml = [i[:-4] for i in os.listdir(dir_xml)]

for i in names_xml:
    if i not in names_json:
        try:
            write_json(i)
            print(f'Succesfully converted {i}')
        except:
            print(f'Fail to convert {i}')
print('All converted!')
