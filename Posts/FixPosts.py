import os

for i in os.listdir():
   if 'index' in i:
      continue
   
   with open(i) as F:
      T = F.read()
   
   ot = len(T)
   T = T.replace('href="', 'href="')
   
   with open(i, 'wt') as F:
      F.write(T)
   
   