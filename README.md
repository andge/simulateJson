simulateJson
============
this is the json preprocessor tool.it generate json data based on rules

for example:

        {
    "       result": 0,
            "data" : "[]@5|{}@ticket:passwd:date|一@[5-8],a@[10-15],1@[10000-1000000]" 
        }

compile with the tool,we can get json 

{
    "result": 0,
    "data": [
        {
            "ticket": "开移土百钱度度拓",
            "passwd": "fUROriSgayn",
            "date": 758169
        },
        {
            "ticket": "拓疆土搜动包移",
            "passwd": "lGThgBzyKsGRgn",
            "date": 728134
        },
        {
            "ticket": "搜土钱拓百移",
            "passwd": "GVIyIgUCGNzHuo",
            "date": 861726
        },
        {
            "ticket": "钱疆云云包包搜",
            "passwd": "PUsRlLOgzscrTLY",
            "date": 499852
        },
        {
            "ticket": "疆钱动拓疆疆",
            "passwd": "scHgXbkNkwbcUPT",
            "date": 834796
        }
    ]
}

rules:
rule 1:
[] or a or 1 or 一 is the data type of the property
[] is array
a is string
1 is number
一 is chinese character

rule2:
@ is the property statement.for example : 
[]@5   meaning the array has five child 
a@[10-15]  meaning the string's length is between 10 and 15

rule3
[1-10]  meaing the length is between 1 and 10  or  the number is bettween 1 and 10 

rule4
| seperate rule
: used for seperate property of object
