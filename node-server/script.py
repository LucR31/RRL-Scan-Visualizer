import json
import xmltodict
import os
import pandas as pd

folder_name = "07-07-2025/"
dir = "./data/"+folder_name
txt_file_name = next((f[:-4] for f in os.listdir(dir) if f.endswith(".txt")), None)

def write_json(file_name):
    # creates .json file from xml
    with open(dir + file_name + ".xml") as xml_file:
        data_dict = xmltodict.parse(xml_file.read())
        xml_file.close()
        json_data = json.dumps(data_dict)
        with open(dir + file_name + ".json", "w") as json_file:
            json_file.write(json_data)
            json_file.close()


def convert_to_json(dir):
    # loops dir and converts if not done already
    json_files = [f[:-5] for f in os.listdir(dir) if f.endswith(".json")]
    xml_files = [f[:-4] for f in os.listdir(dir) if f.endswith(".xml")]
    if not xml_files:
        print("[WARN]: No .xml files found")
        return
    for i in xml_files:
        if i not in json_files:
            try:
                write_json(i)
                print(f"[INFO]: Succesfully converted {i}")
            except:
                print(f"[ERROR]: Fail to convert {i}")
    print("[INFO]: Done!")


convert_to_json(dir)

# ============================================
print("[INFO]: Reformating tendis file")
names = [
    "milliseconds",
    "RRL1A:IST:2",
    "[mm]",
    "RRL1ATEMP:IST:2",
    "[degC_1]",
    "EICV:IST:2",
    "[kV]",
    "RRL1A:I4:2",
    "[µA_1]",
    "RRL1WTO:IST:2",
    "[degC_2]",
    "RRL1WTU:IST:2",
    "[degC_3]",
    "MNC3:IST:2",
    "[uA]",
    "RRL1A:I3:2",
    "[µA_2]",
    "EICI:IST:2",
    "[µA_3]",
    "s",
]
df = pd.read_csv(
    dir + txt_file_name + ".txt",
    sep="\t",
    header=None,
    names=names,
    encoding="unicode_escape",
)
df = df.drop(
    [
        "[degC_1]",
        "[kV]",
        "[µA_1]",
        "[degC_2]",
        "[degC_3]",
        "[µA_2]",
        "[µA_3]",
        "s",
        "[uA]",
        "[mm]",
    ],
    axis=1,
)
df = df.iloc[1:]

# creates the interlock column
def generate_failure(df_col):
    f = [0] * len(df_col)
    for i, j in enumerate(df_col):
        if j == 0:
            f[i] = 1
    return f


# f = generate_failure(df['MNC3:IST:2'])
df["INT"] = generate_failure(df["MNC3:IST:2"])
df["RRL1A:IST:2"] = df["RRL1A:IST:2"].astype(float)
print("[INFO]: INT column created")


def fill_scan_name_col(
    df: pd.DataFrame, list_files: list, rrl_column: str, max_val=4550
) -> pd.DataFrame:
    df["scan"] = 0
    count, indicator = 0, 0
    for i in range(1, len(df)):
        if df.loc[i, rrl_column] < max_val:
            if len(list_files) <= count:
                df.loc[i, "scan"] = 0
            else:
                df.loc[i, "scan"] = list_files[count]
            indicator = 1
        else:
            if indicator == 0:
                pass
            else:
                count += 1
                indicator = 0
    return df


list_files = sorted([f[:-5] for f in os.listdir(dir) if f.endswith(".json")])

df = fill_scan_name_col(df, list_files, "RRL1A:IST:2")
print("[INFO]: scan column created")

df.to_csv(dir + txt_file_name + ".csv", index=False)
print("[INFO]: csv saved")
