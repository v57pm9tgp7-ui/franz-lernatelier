from pathlib import Path
import html, shutil
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
R=Path(__file__).resolve().parents[1]; W=R/'public/module/woche-46'; O=R.parent/'output';O.mkdir(exist_ok=True)
N=colors.HexColor('#16394b');T=colors.HexColor('#177b75'); PALE=colors.HexColor('#edf5f3')
pdfmetrics.registerFont(TTFont('D','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'));pdfmetrics.registerFont(TTFont('DB','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFontFamily('D',normal='D',bold='DB',italic='D',boldItalic='DB')
styles=getSampleStyleSheet()
for k in ['Normal','BodyText']:styles[k].fontName='D';styles[k].fontSize=10;styles[k].leading=14
for k,size in [('Title',26),('Heading1',21),('Heading2',14)]:styles[k].fontName='DB';styles[k].fontSize=size;styles[k].leading=size*1.2;styles[k].textColor=N
styles['Title'].alignment=0
styles['Heading2'].spaceBefore=8;styles['Heading2'].spaceAfter=5
styles.add(ParagraphStyle('Small',fontName='D',fontSize=9,leading=12,textColor=N))
styles.add(ParagraphStyle('White',fontName='DB',fontSize=10,leading=13,textColor=colors.white))
P=lambda s,sty='BodyText':Paragraph(s,styles[sty])
flow=[];web=[]
def title(n,t,sub):
 if flow:flow.append(PageBreak())
 flow.extend([P('FRANZÖSISCH A2 · WOCHE 46','Small'),Spacer(1,10),P(t,'Title'),P(sub),Spacer(1,12)])
 web.append(f'<section id="{n}" class="panel"><span class="eyebrow">WOCHE 46 · FRANZÖSISCH A2</span><h2>{t}</h2><p class="lead">{sub}</p>')
def h(t):flow.append(P(t,'Heading2'));web.append(f'<h3>{t}</h3>')
def para(t):flow.extend([P(t),Spacer(1,5)]);web.append(f'<p>{t}</p>')
def items(lines,numbered=True):
 for i,t in enumerate(lines):flow.extend([P((f'<b>{i+1}.</b> ' if numbered else '• ')+t),Spacer(1,6)])
 tag='ol' if numbered else 'ul';web.append(f'<{tag}>'+''.join(f'<li>{t}</li>' for t in lines)+f'</{tag}>')
def table(headers,rows,widths):
 d=[[P(x,'White') for x in headers]]+[[P(x,'Small') for x in r] for r in rows]
 tb=Table(d,colWidths=widths,repeatRows=1,hAlign='LEFT');tb.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),N),('VALIGN',(0,0),(-1,-1),'TOP'),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,PALE]),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),('LINEBELOW',(0,0),(-1,-1),.4,colors.HexColor('#d4e1df'))]));flow.extend([tb,Spacer(1,6)])
 web.append('<div class="tablewrap"><table><thead><tr>'+''.join('<th>'+x+'</th>' for x in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+x+'</td>' for x in r)+'</tr>' for r in rows)+'</tbody></table></div>')
def end():web.append('</section>')

title('auftrag','Unser Verkaufsdialog','Marché d’occasion · Beurteiltes Rollenspiel in Woche 46')
para('<b>Ihr Ziel:</b> Sie führen zu zweit ein verständliches Verkaufsgespräch auf Französisch. Sie handeln einen Preis aus und vereinbaren Uhrzeit und Treffpunkt. Jede Person erhält eine eigene Note.')
h('So läuft das Rollenspiel ab')
items(['Wählen Sie gemeinsam einen bereits geübten Fall: <b>M1 Kopfhörer, M2 Jacke oder M3 Spielkonsole</b>. Nutzen Sie die Rollenkarten aus Woche 45. Eine Person kauft, die andere verkauft. Legen Sie die Rollen vor der Vorbereitung fest.','Nehmen Sie Ihren Dialog zu zweit mit dem Flip-Videorekorder in der Teams-Aufgabe auf. <b>Richtwert: 2–3 Minuten pro Paar.</b> Die Dauer allein gibt keine Punkte. Entscheidend ist, dass das Gespräch vollständig ist und beide aktiv sprechen.','<b>Für die Aufnahme sprechen beide ohne Notizen.</b> Legen Sie Rollenkarte, Stichwörter und Text weg. Schliessen Sie den Beispieldialog. Öffnen Sie auf dem Gerät die Aufnahme.','Beim Rollenspiel gibt es keine dritte Person als Coach. Falls Ihr Partner oder Ihre Partnerin fehlt, melden Sie sich vor Beginn bei der Lehrperson. Sie klärt einen Ersatz oder Nachholtermin.'])
h('Das gehört in Ihren Dialog')
items(['Begrüssen Sie einander. Machen Sie deutlich, welcher Gegenstand verkauft wird.','Fragen und nennen Sie den Preis. Machen Sie ein Gegenangebot und reagieren Sie darauf. Beachten Sie Budget und Mindestpreis Ihrer Rollen.','Fragen Sie nach einer möglichen Uhrzeit. Einigen Sie sich auf eine Zeit, die für beide passt, und nennen Sie den Treffpunkt.','Fassen Sie die Abmachung mit <b>Preis, Uhrzeit und Ort</b> zusammen. Die andere Person bestätigt sie. Verabschieden Sie sich.'])
para('<b>Beide Personen:</b> Stellen Sie mindestens eine eigene Frage und beantworten Sie Fragen Ihres Gegenübers. Sprechen Sie Zahlen und Uhrzeiten auf Französisch. Schweizer und französische Zahlformen sind gleichwertig.')
para('<b>Wichtig:</b> Sie müssen keinen perfekten Text auswendig können. Kurze Denkpausen sind erlaubt. Fragen Sie nach, wenn Sie etwas nicht verstehen.')
end()
title('beispiel','Ein Dialog als Beispiel','M1 · Ein Kopfhörer · So entwickelt sich das Gespräch Schritt für Schritt.')
para('<b>Blau: Käufer · Orange: Verkäufer.</b> Die Rollen stehen zusätzlich vor jeder Aussage. Lesen Sie zuerst den Ablauf. Passen Sie danach den Dialog an Ihre eigene Rollenkarte an.')
steps=[
('1 · Begrüssen und Interesse zeigen',[
('Käufer','Bonjour ! Le casque est toujours disponible ?'),
('Verkäufer','Bonjour ! Oui, il fonctionne très bien.')]),
('2 · Nach dem Preis fragen und verhandeln',[
('Käufer','Ça coûte combien ?'),
('Verkäufer','Il coûte soixante francs.'),
('Käufer','C’est un peu cher. Cinquante francs, c’est possible ?'),
('Verkäufer','Oui, d’accord. Cinquante francs.')]),
('3 · Eine passende Uhrzeit finden und nachfragen',[
('Verkäufer','Vous pouvez venir à quelle heure ?'),
('Käufer','À dix-huit heures ?'),
('Verkäufer','Désolé, je ne suis pas libre à dix-huit heures. À seize heures trente, c’est possible ?'),
('Käufer','Vous pouvez répéter, s’il vous plaît ?'),
('Verkäufer','À seize heures trente.'),
('Käufer','Oui, ça me va.')]),
('4 · Den Treffpunkt vereinbaren',[
('Käufer','On se retrouve où ?'),
('Verkäufer','À la gare.')]),
('5 · Zusammenfassen, bestätigen und verabschieden',[
('Käufer','Donc, cinquante francs, à seize heures trente, à la gare ?'),
('Verkäufer','Oui, c’est juste. Merci et à bientôt !'),
('Käufer','Merci, à bientôt !')])]
for step,turns in steps:
 h(step)
 rows=[]; commands=[('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4)]
 web.append('<div class="dialogue-step">')
 for i,(role,line) in enumerate(turns):
  buyer=role=='Käufer';colour='#175a89' if buyer else '#963f11';bg='#edf5fc' if buyer else '#fff2e6';cls='buyer' if buyer else 'seller'
  rows.append([P(f'<font color="{colour}"><b>{role}</b></font>','Small'),P(f'<font color="{colour}">{line}</font>','Small')])
  commands.extend([('BACKGROUND',(0,i),(-1,i),colors.HexColor(bg)),('LINEBEFORE',(0,i),(0,i),3,colors.HexColor(colour))])
  web.append(f'<div class="dialogue-turn {cls}"><strong>{role}</strong><span lang="fr">{line}</span></div>')
 tb=Table(rows,colWidths=[89,422],hAlign='LEFT');tb.setStyle(TableStyle(commands));flow.append(tb)
 web.append('</div>')
flow.append(Spacer(1,10))
para('<b>So nutzen Sie das Beispiel:</b> Üben Sie zuerst mit verteilten Rollen. Legen Sie dann den Text weg und sprechen Sie frei. Verändern Sie Gegenstand, Preis, Zeit und Ort passend zu Ihrem Fall.')
end()
title('vorbereitung','So bereiten Sie sich vor','Drei kurze Proben an verschiedenen Tagen sind hilfreicher als einmal sehr lange lesen.')
h('1 · Den Ablauf verstehen · etwa 8 Minuten')
para('Lesen Sie Ihre Rollenkarte. Markieren Sie Preisgrenze, mögliche Zeiten und Treffpunkt. Planen Sie gemeinsam den Gesprächsablauf. Ein Textentwurf ist beim Vorbereiten erlaubt. Prüfen Sie: Ist die Abmachung für beide Rollen möglich? Verstehen Sie jeden Satz, den Sie sagen möchten?')
h('2 · Sprechen und verbessern · etwa 8 Minuten')
para('Spielen Sie den Dialog laut. Schauen Sie danach auf die Kriterien auf Seite 4. Nennen Sie sich gegenseitig eine Stärke und einen Verbesserungspunkt. Wiederholen Sie die schwierige Stelle zweimal. Üben Sie Ihre Preise und Uhrzeiten zusätzlich auf franzatelier.com.')
h('3 · Eine Generalprobe · etwa 8 Minuten')
para('Nutzen Sie Stichwörter für die erste Probe. Legen Sie für die Generalprobe alle Unterlagen weg und spielen Sie den Dialog nochmals. Hören Sie auf Ihr Gegenüber. Bitten Sie in einer Probe bewusst um Wiederholung und reagieren Sie darauf. Üben Sie die tatsächlichen Rollen für das Rollenspiel.')
h('Sprachhilfe zum Üben')
table(['Das möchten Sie sagen','So geht es auf Französisch'],[
['Begrüssen und Interesse zeigen','Bonjour. Je voudrais acheter le casque.'],['Nach dem Preis fragen / Preis nennen','Ça coûte combien ? / Ça coûte soixante francs.'],['Verhandeln','C’est un peu cher. Cinquante francs, c’est possible ?'],['Reagieren','Oui, d’accord. / Non, désolé(e). Je vous propose … francs.'],['Zeit und Ort vereinbaren','Vous pouvez venir à quelle heure ? / Je peux venir à …<br/>On se retrouve où ? / À la gare.'],['Nachfragen','Vous pouvez répéter, s’il vous plaît ?<br/>Plus lentement, s’il vous plaît.'],['Abmachung bestätigen','Donc, … francs, à …, devant l’école.<br/>Oui, c’est juste. Merci et à bientôt !']],[190,321])
para('<b>Stichwörter für die erste Probe:</b> bonjour · objet · prix · proposition · heure · lieu · accord · merci<br/>Ergänzen Sie nur Ihre eigenen Zahlen, Zeiten und Ortsnamen. Wählen Sie Wörter, die Ihnen beim freien Sprechen helfen.')
para('<b>Mein Schlusscheck:</b> Kenne ich meine Rolle? Kann ich ohne Notizen sprechen? Reagiere ich auf mein Gegenüber? Sind Preis, Zeit und Ort klar?')
end()
title('kriterien','So wird beurteilt','Einzelbeurteilung · 5 Kriterien mit je 0–4 Punkten · maximal 20 Punkte')
para('Beide Personen werden nach denselben Kriterien beurteilt. Die Lehrperson schaut auf <b>Ihren eigenen Beitrag</b>. Sie erhalten keine gemeinsame Paarnote.')
criteria=[
['1 · Auftrag erfüllen','Sie erfüllen Ihre Rolle: Gegenstand und Preis sind klar, Sie verhandeln und wirken an einer gültigen Abmachung mit Uhrzeit und Ort mit. Sie bestätigen die Abmachung oder fassen sie zusammen.','____ / 4'],
['2 · Aufeinander reagieren','Sie stellen mindestens eine passende eigene Frage, beantworten Fragen und greifen Vorschläge auf. Sie hören zu. Wenn nötig, fragen Sie nach. Eine Nachfrage zählt als gute Gesprächsstrategie.','____ / 4'],
['3 · Verständlich sprechen','Sie sprechen hörbar und in verständlichem Tempo. Gegenstand, Preise und Uhrzeiten sind gut zu verstehen. Ein muttersprachlicher Akzent wird nicht erwartet.','____ / 4'],
['4 · Passende Sprache verwenden','Sie verwenden passende französische Wörter und einfache Sätze. Die wichtigsten Verbformen und Satzmuster gelingen. Einzelne kleine Fehler sind erlaubt.','____ / 4'],
['5 · Frei sprechen','Sie führen das Gespräch frei, ohne Notizen, Rollenkarte oder eingeblendeten Text. Nach einer Pause finden Sie selbst weiter oder nutzen eine französische Gesprächshilfe.','____ / 4']]
table(['Kriterium','Darauf achtet die Lehrperson','Punkte'],criteria,[110,342,59])
h('Was bedeuten die Punkte?')
table(['Punkte','Für jedes Kriterium gilt'],[['4','Das gelingt sicher und weitgehend selbständig.'],['3','Das gelingt meistens. Es gibt einzelne Unsicherheiten.'],['2','Das gelingt teilweise. Es gibt mehrere Lücken oder wiederholten Unterstützungsbedarf.'],['1','Das gelingt erst in Ansätzen. Vieles fehlt oder gelingt nur mit starker Hilfe.'],['0','Für dieses Kriterium ist im Rollenspiel keine Leistung erkennbar.']],[65,446])
para('<b>Faire Beurteilung:</b> Sprachfehler betreffen Kriterium 4 und nur bei tatsächlichen Verständnisproblemen auch Kriterium 3. Derselbe Fehler wird nicht automatisch mehrfach bestraft. Selbstkorrekturen sind erlaubt.')
para('<b>Note:</b> 1 + 5 × (erreichte Punkte ÷ 20), auf eine Dezimalstelle gerundet.<br/>Beispiele: 12 Punkte = 4,0 · 16 Punkte = 5,0 · 20 Punkte = 6,0.')
para('<b>Name:</b> __________________________ &nbsp; <b>Rolle / Fall:</b> ____________________<br/><b>Total:</b> ______ / 20 &nbsp;&nbsp; <b>Note:</b> ______ &nbsp;&nbsp; <b>Datum:</b> ____________________')
para('<b>Das gelingt schon:</b> ___________________________________________________<br/><b>Ihr nächster Schritt:</b> __________________________________________________')
end()
def decor(c,d):
 c.setStrokeColor(T);c.setLineWidth(3);c.line(36,817,559,817)
 c.drawImage(str(R/'public/module/woche-44/assets/BFF.png'),510,775,45,45,mask='auto',preserveAspectRatio=True)
 c.setFont('D',8);c.setFillColor(N);c.drawString(36,23,'Französisch A2 · Verkaufsdialog · Woche 46');c.drawRightString(559,23,str(d.page))
pdf=O/'VerkaufsdialogWoche46.pdf'
SimpleDocTemplate(str(pdf),pagesize=(595.28,841.89),leftMargin=36,rightMargin=36,topMargin=48,bottomMargin=36,title='Verkaufsdialog Woche 46',author='Franz Lernatelier · BFF Bern').build(flow,onFirstPage=decor,onLaterPages=decor)
shutil.copy2(pdf,W/'material'/pdf.name)
css='''.dialogue-step{margin:12px 0 26px}.dialogue-turn{display:grid;grid-template-columns:115px 1fr;gap:14px;padding:12px 16px;border-left:4px solid;margin:4px 0;border-radius:0 8px 8px 0}.dialogue-turn.buyer{background:#edf5fc;color:#175a89;border-color:#175a89}.dialogue-turn.seller{background:#fff2e6;color:#963f11;border-color:#963f11}@media(max-width:640px){.dialogue-turn{grid-template-columns:1fr;gap:3px}}body{color:#17384a;background:#f3f7f6}h1{max-width:900px}.assessment-hero{padding:32px 0 20px}.assessment-hero p{max-width:800px}.panel{margin:22px 0}li{margin:10px 0;line-height:1.65}p{line-height:1.65}.mainnav{position:sticky;top:0;z-index:5}.rubric td{vertical-align:top}th,td{padding:12px!important}td:last-child{min-width:60px}.actions{margin:16px 0}section{scroll-margin-top:95px}.prepcheck label{display:block;padding:12px;border-bottom:1px solid #d4e1df}.prepcheck input{margin-right:10px;width:20px;height:20px} @media(max-width:640px){.mainnav{position:static}.panel{padding:18px}.tablewrap{overflow-x:auto}section{scroll-margin-top:16px}} @media print{header,nav,.actions,.prepcheck{display:none}.panel{border:0;page-break-before:always}.assessment-hero{display:none}footer{display:none}body{background:white}}'''
body=''.join(web)
checklabels=['Ich kenne meine Rolle und meine Preisgrenze.','Ich kann meine Preise und Uhrzeiten auf Französisch sagen.','Ich habe mindestens eine eigene Frage vorbereitet.','Ich habe mit meiner Partnerperson laut geübt.','Ich habe ohne Notizen und ohne Rollenkarte geprobt.','Ich habe die Beurteilungskriterien gelesen.']
checks=''.join(f'<label><input type="checkbox" data-check="{i}">{t}</label>' for i,t in enumerate(checklabels))
head='''<!doctype html><html lang="de-CH"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Verkaufsdialog · Woche 46 · Franz Lernatelier</title><meta name="description" content="Auftrag, Vorbereitung und Beurteilung für den Verkaufsdialog in Woche 46."><link rel="stylesheet" href="../woche-45/woche45.css"><style>'''+css+'''</style></head><body><a class="skip" href="#main">Direkt zum Auftrag</a><header><div class="brand"><a href="../../index.html"><strong>FRANZ LERNATELIER</strong><span>Französisch mit Herrn Marti</span></a><img src="../woche-44/assets/BFF.png" width="66" height="66" alt="BFF Bern"></div><a href="../woche-45/">Zurück zu Woche 45</a></header><div class="shell"><main id="main"><div class="assessment-hero"><span class="eyebrow">VORBEREITUNG AUF WOCHE 46</span><h1>Unser Verkaufsdialog</h1><p class="lead">Sie haben das Gespräch im Marché geübt. In Woche 46 nehmen Sie Ihr Rollenspiel zu zweit in Teams auf. Hier finden Sie den Auftrag, Ihre Vorbereitung und die Beurteilung.</p><div class="actions"><a class="btn" href="material/VerkaufsdialogWoche46.pdf" download>Auftrag und Kriterien als PDF</a><a class="btn secondary" href="../woche-45/#mission-2">Geübte Rollenkarten öffnen</a><a class="btn secondary" href="material/FranzW46Lernheft.pdf">Lernheft Woche 46</a><a class="btn secondary" href="../../verbentrainer/?set=2026W46&amp;learn=1">Neue Verben lernen</a></div></div><nav class="mainnav" aria-label="Auftrag und Vorbereitung"><a href="#auftrag">1 · Auftrag</a><a href="#beispiel">2 · Beispieldialog</a><a href="#vorbereitung">3 · Vorbereitung</a><a href="#kriterien">4 · Beurteilung</a><a href="#check">Mein Check</a></nav>'''
links='''<div class="actions"><a class="btn secondary" href="../woche-45/training.html#numbers">Preise üben</a><a class="btn secondary" href="../woche-45/training.html#times">Uhrzeiten üben</a><a class="btn secondary" href="../../verbentrainer/">Verben üben</a></div>'''
body=body.replace('auf Seite 4','im Abschnitt «Beurteilung»')
foot='''<section id="check" class="panel prepcheck"><h2>Bin ich bereit?</h2><p>Setzen Sie ein Häkchen, wenn Sie den Punkt erledigt haben. Dies ist Ihr persönlicher Check, keine automatische Bewertung.</p>'''+checks+'''<p id="saveNote" class="muted">Ihre Häkchen bleiben in diesem Browser gespeichert.</p>'''+links+'''</section></main><footer><a href="../woche-45/">Zur Wochenübersicht</a> · <a href="material/VerkaufsdialogWoche46.pdf">PDF öffnen</a></footer></div><script src="dialogue.js"></script></body></html>'''
(W/'dialogue.html').write_text(head+body+foot)
(W/'dialogue.js').write_text('''(()=>{const key='franzW46DialoguePrep_v1';let state={};try{state=JSON.parse(localStorage.getItem(key)||'{}');}catch{}document.querySelectorAll('[data-check]').forEach(input=>{input.checked=!!state[input.dataset.check];input.addEventListener('change',()=>{state[input.dataset.check]=input.checked;try{localStorage.setItem(key,JSON.stringify(state));}catch{document.getElementById('saveNote').textContent='Speichern ist nicht verfügbar. Notieren Sie Ihren Stand auf dem PDF.'}})})})();''')
print(pdf)
