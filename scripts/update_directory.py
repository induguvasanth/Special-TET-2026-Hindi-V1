"""Run from GitHub Pages repository root (github/ files must be at root)."""
import json, re, urllib.request, pathlib
URL='https://script.google.com/macros/s/AKfycbwoSKTSJoshstkrbaW4mwlluCYQlTLo8Ld62GDWPzdIMEvO6YkXiNVzT5UGVq2M5tyQ/exec?callback=tetSnapshot'
req=urllib.request.Request(URL,headers={'User-Agent':'Mozilla/5.0'})
with urllib.request.urlopen(req,timeout=35) as response: raw=response.read().decode('utf-8-sig').strip()
m=re.fullmatch(r'tetSnapshot\((.*)\);?',raw,re.S)
if not m: raise RuntimeError('Directory endpoint did not return JSONP. Check public Apps Script permissions.')
data=json.loads(m.group(1))
if not isinstance(data.get('topics'),list) or len(data['topics'])<20: raise RuntimeError('Too few topics: keeping existing snapshot')
full=sum(bool(t.get('fullUrl')) for t in data['topics'])
short=sum(bool(t.get('shortUrl')) for t in data['topics'])
if full<20 or short<15: raise RuntimeError('Too few quiz links: keeping existing snapshot')
out=pathlib.Path('directory-data.js')
out.write_text('window.TET_DIRECTORY_SNAPSHOT = '+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\/')+';\n',encoding='utf-8')
print(f'Wrote {len(data["topics"])} topics; {full} full links; {short} short links')
