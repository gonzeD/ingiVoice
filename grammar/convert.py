original= open("full.jsgf")
corrected = open("fullCorrected.jsgf","w+")

line = original.readline()
#print(original.read())
cnt = 1

mapping = [
 ["'('"," 'openParenthesis' "],
 ["')'"," 'closeParenthesis' "],
 ["'['"," 'openBrackets' "],
 ["']'"," 'closeBracketss' "],
 ["'{'"," 'openCurly' "],
 ["'}'"," 'closeCurly' "],
 ["'*'"," 'multiply' "],
 ["'**'"," 'pow' "],
 ["';'"," 'semicolon' "],
 ["'.'"," 'dot' "],
 ["'^'"," 'binaryXor' "],
 ["'&'"," 'binaryAnd' "],
 ["'...'"," 'threeDot' "],
 ["'+='" , " 'equalPlus' "],
 ["'-='", " 'equalMinus' "],
 ["'*='", " 'equalMultiply' "],
 ["'@='", " 'equalAt' "],
 ["'/='", " 'equalDivide' "],
 ["'%='", " 'equalModulo' "],
 ["'&='", " 'equalBinaryAnd' "],
 ["'|='", " 'equalBinaryOr' "],
 ["'^='", " 'equalBinaryXor' "],
 ["'<<='", " 'equalLeftShift' "],
 ["'>>='", " 'equalRightShift' "],
 ["'**='", " 'equalPow' "],
 ["'//='", " 'equalDivideEuclidian' "],
 ["'>>'", " 'rightShift' "],
 ["'<<'", " 'leftShift' "],
 ["'=='", " 'doubleEqual' "],
 ["'>='", " 'greaterOrEqualThan' "],
 ["'<='", " 'lowerOrEqualThan' "],
 ["'<>'", " 'airplane' "],
 ["'!='", " 'different' "],
 ["'+'", " 'plus' "],
 ["'-'", " 'minus' "],
 ["'/'", " 'divide' "],
 ["'%'", " 'modulo' "],
 ["'//'" , " 'divideEuclidian' "],
 ["'~'" , " 'tilde' "],
 ["':='", " 'equalColon' "],
 ["'<'", " 'lowerThan' "],
 ["'>'", " 'greaterThan' "],
 ["'|'"," 'binaryOr' "],
  ["':'","'colon' "],
  [":","= "],
 ["("," ( "],
 [")"," ) "],
 ["["," [ "],
 ["]"," ] "],
 ["*"," * "],
 ["+"," + "],
 ["|"," | "],
]
secondMapping = [
 ["NEWLINE","endLine"],
 ["ENDMARKER",""],
 ["NAME"," variable "],
 ["'='"," equal "],
 ["="," = "],
 ["|"," | "],
 ["("," ( "],
 [")"," ) "],
 ["*"," * "],
 ["+"," + "],
 ["["," [ "],
 ["]"," ] "],
 ["'->'"," arrow "],
 ["'@'"," at "],
 ["','","comma"],
 ["'/'","divide"],
 ["'*'","multiply"],
 ["'**'","pow"],

]
#print(line);

corrected.write("#JSGF V1.0;\n");
corrected.write("grammar base; \n");
corrected.write("public ")
while line:
    if line[0] != "#" and line.strip() != "":
        line = line.strip();

        for i in mapping :
            line = line.replace(i[0]," "+i[1]+" ")
        x = line.split(" ");
        print(line)
        for i in x:
            flag = False
            for j in secondMapping :
                if i == j[0]:
                    print(i)
                    print(j[0])
                    flag = True;
                    corrected.write(" "+j[1]+" ")
            if flag :
                pass
            elif len(i)>0 and i[0] == "'":
                corrected.write(" "+i[1:-1]+" ")
            elif i.islower():
                corrected.write(" <"+i+"> ")
            elif i.isupper():
                corrected.write(" "+i.lower()+" ")

            corrected.flush()
        corrected.flush()
        corrected.write(";\n")
        corrected.flush()
    line = original.readline()
original.close();
corrected.close();
