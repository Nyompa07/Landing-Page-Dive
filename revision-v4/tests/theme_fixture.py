"""Render homepage branch for local testing; this does not emulate Blogger compiler."""
from pathlib import Path
import xml.etree.ElementTree as ET
import re, html
root=Path(__file__).resolve().parents[1]
tree=ET.parse(root/'blogger-theme.xml')
ns={'h':'http://www.w3.org/1999/xhtml','b':'http://www.google.com/2005/gml/b'}
assert len(tree.findall('.//b:skin',ns))==1
assert len(tree.findall('.//b:section',ns))==1
assert tree.find('.//b:widget',ns).get('id')=='Blog1'
home=tree.find('h:body/b:if',ns)
ET.register_namespace('',ns['h'])
markup=''.join(ET.tostring(el,encoding='unicode',method='html') for el in home)
# XML serialization escapes script text. HTML parsers need literal script text.
# HTML serialization preserves literal script text.
css=tree.find('.//b:skin',ns).text
(root/'tests/theme-fixture.html').write_text('<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"/><title>Gowa Theme Fixture</title><style>'+css+'</style></head><body>'+markup+'</body></html>')
print('XML structure valid; homepage fixture assembled')
