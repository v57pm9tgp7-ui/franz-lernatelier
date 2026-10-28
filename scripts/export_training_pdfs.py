from pathlib import Path
import json,html
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor,white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph,Table,TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'training-export';OUT.mkdir(exist_ok=True)
for n,f in [('Body','DejaVuSans.ttf'),('Bold','DejaVuSans-Bold.ttf')]:pdfmetrics.registerFont(TTFont(n,'/usr/share/fonts/truetype/dejavu/'+f))
NAVY=HexColor('#163955');TEAL=HexColor('#237E73');BLUE=HexColor('#1C698A');MUTED=HexColor('#4C667A');PALE=HexColor('#F1F6FA');GREEN=HexColor('#E8F4EF');LINE=HexColor('#CEDDE6')
W,H=595.28,841.89;L=44;CW=W-2*L;logo=ROOT/'public/module/woche-44/assets/BFF.png'
def para(s,size=11,bold=False,color=NAVY,leading=None):return Paragraph(s,ParagraphStyle('p',fontName='Bold'if bold else'Body',fontSize=size,leading=leading or size*1.4,textColor=color,spaceAfter=0))
class Doc:
 def __init__(self,name):
  self.path=OUT/name;self.c=canvas.Canvas(str(self.path),pagesize=(W,H));self.c.setTitle(name[:-4]);self.c.setAuthor('Franz Lernatelier · BFF Bern');self.n=0;self.pages=[];self.y=0
 def page(self,code,title,sub=''):
  if self.n:self.end()
  self.n+=1;self.pages.append((code,title));c=self.c;c.setFillColor(PALE);c.rect(0,H-151,W,151,fill=1,stroke=0);c.setFillColor(NAVY);c.rect(0,H-6,W,6,fill=1,stroke=0);c.drawImage(str(logo),W-84,H-72,42,42,mask='auto');self.y=H-38;self.p('FRANZ LERNATELIER · WOCHE 44',9,True,BLUE);self.y-=7;self.p(code,10,True,TEAL);self.y-=8;self.p(title,23,True);self.y-=5
  if sub:self.p(sub,10,color=MUTED)
  self.y=min(self.y,H-165)
 def p(self,s,size=11,bold=False,color=NAVY,gap=9):
  p=para(s,size,bold,color);_,h=p.wrap(CW,1000);self.y-=h;p.drawOn(self.c,L,self.y);self.y-=gap
 def h(self,s):self.y-=6;self.p(s,13,True,TEAL,8)
 def box(self,s,bg=GREEN,size=11):
  p=para(s,size);_,h=p.wrap(CW-26,1000);self.c.setFillColor(bg);self.c.roundRect(L,self.y-h-24,CW,h+24,7,fill=1,stroke=0);p.drawOn(self.c,L+13,self.y-h-12);self.y-=h+36
 def table(self,rows,widths=None,font=10,rowheights=None):
  vals=[[para(str(v),font,bold=(i==0 or j==0),color=white if i==0 else NAVY,leading=font*1.3) for j,v in enumerate(row)]for i,row in enumerate(rows)]
  t=Table(vals,colWidths=widths or [CW/len(rows[0])]*len(rows[0]),rowHeights=rowheights,hAlign='LEFT');style=[('BACKGROUND',(0,0),(-1,0),NAVY),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LINEBELOW',(0,0),(-1,-1),.5,LINE)]
  for i in range(1,len(rows)):style.append(('BACKGROUND',(0,i),(-1,i),white if i%2 else PALE))
  t.setStyle(TableStyle(style));_,h=t.wrap(CW,1000);self.y-=h;t.drawOn(self.c,L,self.y);self.y-=13
 def lines(self,n=2,labels=None,height=27):
  c=self.c;c.setStrokeColor(LINE);c.setLineWidth(.6)
  for i in range(n):
   if labels:self.p(labels[i],10,gap=0)
   self.y-=height;c.line(L,self.y,L+CW,self.y)
  self.y-=12
 def task(self,label,text,lines=0):self.h(label);self.p(text);self.lines(lines)if lines else None
 def end(self):
  if self.y<49:raise ValueError(f'Overflow {self.path.name} page {self.n} y {self.y}')
  c=self.c;c.setStrokeColor(LINE);c.line(L,39,W-L,39);c.setFillColor(MUTED);c.setFont('Body',8);c.drawString(L,25,'Français A2 · semaine 44 · '+self.pages[-1][0]);c.drawRightString(W-L,25,str(self.n));c.showPage()
 def save(self):self.end();self.c.save();return {'name':self.path.name,'pages':self.n,'map':self.pages}

import shutil, subprocess, argparse, re
parser=argparse.ArgumentParser(description='PDFs aus dem aktuellen Verbkatalog erstellen (Python: reportlab; Node.js für die Probe).')
parser.add_argument('--verb-set',help='Nur die Verbübersicht dieser Wochenmenge; all für alle Verben')
args=parser.parse_args()
C=json.JSONDecoder().raw_decode((ROOT/'public/verbentrainer/data.js').read_text(encoding='utf-8').split('=',1)[1].lstrip())[0]
byid={v['id']:v for v in C['verbs']}
def subset(id):
 if id=='all':return C['verbs']
 item=next((s for s in C['sets']if s['id']==id),None)
 if item is None:raise ValueError('Unbekannte Auswahl: '+id)
 return [byid[i]for i in item['verbIds']]
V=subset('test44');persons=['je / j’','tu','il / elle / on','nous','vous','ils / elles']
def charts(name,vs):
 d=Doc(name)
 for start in range(0,len(vs),3):
  d.page('VERBEN · PRÉSENT', 'Les verbes', 'Französisch und Deutsch · drei Verben pro Lernportion')
  for v in vs[start:start+3]:
   d.h(v['fr']+' · '+v['de']);d.table([persons,v['forms']],[CW/6]*6,font=10.5,rowheights=[33,36]);d.p(('J’'if v['forms'][0][0]in'aeioué'else'Je ')+v['forms'][0]+' '+v['tail'],11);d.y-=8
  d.h('So üben Sie');d.p('1. Lesen Sie Bedeutung und Beispiel.<br/>2. Decken Sie die Formen ab und sagen oder schreiben Sie sie aus dem Kopf.<br/>3. Vergleichen Sie und markieren Sie unsichere Formen.<br/>4. Fragen Sie diese nach einer Pause und an einem späteren Tag nochmals ab.',10)
  d.p('on verwendet dieselbe Form wie il/elle; elles wie ils. Vor Vokal: j’ai, j’aime. Die Übersetzungen nennen die für dieses Training verwendeten Grundbedeutungen.',9,color=MUTED)
 d.save()
if args.verb_set:
 title=re.sub(r'[^\w -]','',args.verb_set)
 name='Französisch Verben '+title+'.pdf';charts(name,subset(args.verb_set))
 print(OUT/name);raise SystemExit(0)
js="const fs=require('node:fs'),vm=require('node:vm'),c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync('public/verbentrainer/data.js','utf8'),c);let seed=1;const rng=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);console.log(JSON.stringify(require('./public/verbentrainer/insights.js').exam(require('./public/verbentrainer/engine.js'),c.window.VERB_CATALOG,rng)));"
EX=json.loads(subprocess.check_output(['node','-e',js],cwd=ROOT,text=True))
charts('Französisch Verben Wochen 43 und 44.pdf',V);charts('Französisch Verben Woche 43.pdf',subset('2026W43'));charts('Französisch Verben Woche 44.pdf',subset('2026W44'))
def prompt(q):return q['v']['de']+' → Französisch'if q['type']=='de-fr'else q['v']['fr']+' → Deutsch'if q['type']=='fr-de'else persons[q['p']]+' … ('+q['v']['fr']+')'
def answer(q):return q['v']['fr']if q['type']=='de-fr'else q['v']['de']if q['type']=='fr-de'else q['v']['forms'][q['p']]
d=Doc('Französisch Verben Übungsheft.pdf')
for start in [0,5,10]:
 d.page('V · ABDECKEN UND ABRUFEN','Le présent aus dem Kopf','Name: __________________ · Eine passende deutsche Grundbedeutung ergänzen.')
 d.table([['Verb / Deutsch',*persons]]+[[v['fr']+'<br/>____________',*['']*6]for v in V[start:start+5]],[141]+[(CW-141)/6]*6,9,rowheights=[40]+[65]*5)
 d.h('Meine zwei schwierigen Formen');d.lines(2,height=26);d.p('Erst selbst versuchen, dann mit der Verbübersicht vergleichen. Eine leere Zelle zeigt Ihren nächsten Übeschritt.',10)
d.page('V · ANWENDEN','Formen flexibel verwenden','Nur die verlangte Verbform ergänzen.')
q=['je peux → nous …','tu sais → vous …','elle voit → ils …','nous faisons → je …','vous prenez → tu …','ils viennent → nous …','Falsch: vous disez. Richtig: vous …','Falsch: ils mettons. Richtig: ils …','Falsch: je va. Richtig: je …','Nous … (avoir) trente francs.','Tu … (devoir) partir.','Vous … (vouloir) jouer au mini-golf.']
d.table([['Aufgabe','Antwort']]+[[x,'']for x in q],[335,CW-335],10,rowheights=[31]+[31]*12);d.p('Sagen Sie danach drei eigene Sätze zu Freizeit, Schule oder Ihrem Tagesablauf.',10)
for part in range(2):
 d.page('V · TESTSIMULATION '+str(part+1)+' / 2','Wenn heute der Test wäre','30 Aufgaben insgesamt · ohne Hilfen · erst nach beiden Seiten auswerten')
 d.table([['Nr.','Aufgabe','Antwort']]+[[str(i+1),prompt(EX[i]),'']for i in range(part*15,part*15+15)],[36,286,CW-322],9.5,rowheights=[27]+[27]*15)
 if part==1:d.p('Je richtige Antwort 1 Punkt. Note = 1 + 5 × Punkte ÷ 30; auf eine Dezimalstelle runden. 18 Punkte = 4,0. Eine Übungseinschätzung, keine sichere Vorhersage des echten Tests. Die Lehrperson kann anders gewichten.',10)
 d.p('Ihre erste Antwort stehen lassen. Fehler danach markieren und mit einer Pause erneut abrufen.',10)
d.save()
l=Doc('Französisch Verben Lösungen.pdf');l.page('LÖSUNGEN · VERBEN','Vergleichen und weiterüben','Leere Konjugationstabellen: vollständige Lösungen in den drei Verbübersichten.')
l.table([['Aufgabe','Lösung']]+[[str(i+1)+' · '+x,y]for i,(x,y)in enumerate(zip(q,['pouvons','savez','voient','fais','prends','venons','dites','mettent','vais','avons','dois','voulez']))],[330,CW-330],10)
l.p('Die Hilfen dienen dem Lernen. Für eine Noteneinschätzung lösen Sie beide Testseiten zuerst ohne Tabelle und ohne Lösungen.',10)
l.page('LÖSUNGEN · TESTSIMULATION','Ihre Probe auswerten','Eine passende Grundbedeutung genügt. Akzente und Personen müssen stimmen.')
l.table([['Nr.','Lösung','Nr.','Lösung']]+[[str(i+1),answer(EX[i]),str(i+16),answer(EX[i+15])]for i in range(15)],[36,217,36,CW-289],9,rowheights=[29]+[28]*15)
l.p('0 Punkte = 1,0; 12 = 3,0; 18 = 4,0; 21 = 4,5; 24 = 5,0; 27 = 5,5; 30 = 6,0. Andere Werte: 1 + 5 × Punkte ÷ 30, auf eine Dezimalstelle runden.',10);l.save()
# Additional practice sheets with varied, concrete A2 tasks.
d=Doc('Französisch Zahlen Uhrzeiten Meinungen Übungsheft.pdf')
d.page('Z1 · ZAHLEN','Les nombres en action','Soutien: Zahlentafel verwenden. Standard: erst ohne Hilfe. Avancé: Schweizer Varianten ergänzen.')
d.h('1 · Zahlen ausschreiben');d.table([['Zahl','Französisch']]+[[str(x),'']for x in [13,30,16,60,71,80,81,91,99,100]],[75,CW-75],10,rowheights=[28]+[28]*10)
d.h('2 · Zurück zu Ziffern');d.p('quarante-huit = _____ · soixante-douze = _____<br/>quatre-vingt-seize = _____ · cinquante et un = _____');d.lines(1,height=20)
d.page('Z2 · PREISE UND SPRACHVARIANTEN','Ça coûte combien ?','Sprechen Sie jede Lösung auch laut aus.')
d.h('3 · Rückgeld');d.table([['Sie bezahlen','Sie geben','Rückgeld als französisches Wort'],['22 CHF','30 CHF',''],['26 CHF','50 CHF',''],['44 CHF','100 CHF',''],['19 CHF','100 CHF',''],['9 CHF','100 CHF','']],[100,90,CW-190],10,rowheights=[35]+[39]*5)
d.h('4 · Fehler verbessern');d.p('71: soixante onze<br/>80: quatre-vingt<br/>81: quatre-vingts-un<br/>91: quatre-vingt et onze');d.lines(4,height=24)
d.h('5 · Frankreichformen');d.p('septante et un = ___________________________<br/>huitante = _______________________________<br/>nonante-neuf = ___________________________',11)
d.page('U2 · UHRZEITEN','Quelle heure est-il ?','Verwenden Sie eindeutige offizielle Uhrzeiten. Viertel- und Halbstundenformen zusätzlich üben.')
d.h('1 · Uhrzeiten schreiben');d.table([['Zeit','Französisch']]+[[x,'']for x in ['07:00','13:15','14:30','16:45','00:00','12:00']],[90,CW-90],11,rowheights=[31]+[37]*6)
d.h('2 · Digital notieren');d.p('dix-neuf heures vingt = __________<br/>vingt-trois heures cinquante-cinq = __________<br/>une heure trente = __________<br/>quatorze heures cinq = __________');d.h('3 · Termine und aktuelle Zeit');d.p('On se retrouve _____ quinze heures.<br/>_____ dix heures. (Es ist jetzt zehn Uhr.)');d.lines(1,height=24)
d.page('U3 · ZEITRECHNEN UND SPRECHEN','On se retrouve à…','Berechnen Sie die Zeit; sagen Sie sie danach auf Französisch.')
d.table([['Ausgangszeit','Rechnen Sie','Neue Uhrzeit'],['14:55','+ 10 Minuten',''],['23:50','+ 45 Minuten',''],['00:05','− 15 Minuten',''],['12:30','+ 30 Minuten',''],['16:40','− 15 Minuten','']],[140,175,CW-315],11,rowheights=[33]+[45]*5)
d.h('Partnerdialog');d.p('A schlägt eine Treffzeit vor. B kann erst 15 Minuten später kommen. Einigen Sie sich auf eine Zeit. Tauschen Sie anschliessend die Rollen.')
d.box('A: On se retrouve à … ?<br/>B: Je peux venir à …<br/>A: D’accord. On se retrouve à …')
d.h('Die zweite Runde');d.p('Verwenden Sie andere Zeiten. Decken Sie die Satzanfänge ab, sobald Sie sie nicht mehr brauchen.');d.lines(2,height=28)
d.page('O1 · MEINUNGEN','Donner son opinion','Zuerst selbst versuchen. Dann zu zweit laut lesen und eine Aktivität ersetzen.')
d.h('1 · Die Verbindung wählen');d.p('Je préfère le ping-pong ______ c’est sportif. (parce que / mais)<br/>Je voudrais aller au cinéma, ______ c’est trop cher. (parce que / mais)<br/>Je suis d’accord ______ toi. (avec / à)<br/>______ mon avis, c’est intéressant. (À / Dans)')
d.h('2 · Einen Satz bilden');d.p('le mini-golf / Je préfère / c’est amusant. / parce que');d.lines(2,height=24);d.p('mais / le cinéma. / Je comprends, / je préfère');d.lines(2,height=24)
d.h('3 · Freundlich reagieren');d.p('Ihr Gegenüber schlägt Bowling vor. Sie möchten lieber eine Fotochallenge. Antworten Sie freundlich, nennen Sie einen Grund und fragen Sie nach der Meinung.');d.lines(4,height=28)
d.page('O2 · GESPRÄCHE','Vos idées comptent','Wählen Sie zwei Situationen. Jeweils beide sprechen und aufeinander reagieren.')
for title,task in [('Freier Samstag','Mini-Golf oder Fotochallenge? Jede Person nennt eine Vorliebe und einen Grund.'),('Gemeinsam lernen','Allein oder zu zweit lernen? Nennen Sie Ihre Meinung. Reagieren Sie auf ein Gegenargument.'),('Unser Klassenanlass','Ein Ausflug mit Sport oder Kultur? Einigen Sie sich auf eine Aktivität und eine Uhrzeit.')]:d.h(title);d.p(task);d.lines(2,height=24)
d.box('Je préfère … parce que … · À mon avis …<br/>Je comprends, mais … · Je suis d’accord avec toi.<br/>Et toi, qu’est-ce que tu en penses ?')
d.p('Selbstkontrolle: □ Meinung □ Grund □ Reaktion/Rückfrage.<br/>Soutien: Satzanfänge offen. Avancé: zwei Gründe und ein Gegenargument.',10);d.save()
l=Doc('Französisch Zahlen Uhrzeiten Meinungen Lösungen.pdf');l.page('LÖSUNGEN · ZAHLEN','Les nombres','Schweizer Zahlformen sind korrekt; Aufgabe 5 verlangt ausdrücklich die Frankreichform.')
l.h('Z1');l.p('13 treize · 30 trente · 16 seize · 60 soixante<br/>71 soixante et onze · 80 quatre-vingts · 81 quatre-vingt-un<br/>91 quatre-vingt-onze · 99 quatre-vingt-dix-neuf · 100 cent.<br/>Ziffern: 48, 72, 96, 51.')
l.h('Z2');l.p('Rückgeld: 8 huit; 24 vingt-quatre; 56 cinquante-six; 81 quatre-vingt-un; 91 quatre-vingt-onze.<br/>Korrekturen: soixante et onze; quatre-vingts; quatre-vingt-un; quatre-vingt-onze.<br/>Frankreichformen: soixante et onze; quatre-vingts; quatre-vingt-dix-neuf.')
l.h('So nutzen Sie Fehler');l.p('Markieren Sie zwei unsichere Zahlen. Sagen Sie, wie sie aufgebaut sind. Decken Sie die Lösungen ab und schreiben Sie sie nach einer Pause nochmals.')
l.page('LÖSUNGEN · UHRZEITEN UND MEINUNGEN','Verstehen und anwenden','Bei freien Gesprächen gibt es mehrere passende Lösungen.')
l.h('U2');l.p('sept heures; treize heures quinze; quatorze heures trente; seize heures quarante-cinq; minuit; midi.<br/>Auch: une heure et quart de l’après-midi; deux heures et demie de l’après-midi; cinq heures moins le quart de l’après-midi.<br/>Digital: 19:20; 23:55; 01:30; 14:05.<br/>Termine: à. Aktuelle Zeit: Il est.',10)
l.h('U3');l.p('15:05; 00:35 am Folgetag; 23:50 am Vortag; 13:00; 16:25.<br/>Beispiel: On se retrouve à quatorze heures ? / Je peux venir à quatorze heures quinze. / D’accord.',10)
l.h('O1');l.p('parce que; mais; avec; À.<br/>Je préfère le mini-golf parce que c’est amusant.<br/>Je comprends, mais je préfère le cinéma.<br/>Beispiel: Je comprends, mais je préfère faire un défi photo parce que c’est gratuit. Et toi, qu’est-ce que tu en penses ?',10)
l.h('O2 · Worauf Sie achten');l.p('Eine verständliche Meinung, ein inhaltlich passender Grund und eine Reaktion oder Rückfrage. Das Gegenüber muss nicht derselben Meinung sein. Erst nach dem ersten Versuch eine Stelle verbessern und nochmals sagen.',10);l.save()
d=Doc('Französisch Lerntraining Kurzanleitung.pdf')
d.page('LERNEN MIT PLAN','So kommen Sie weiter','Verbentrainer · Zahlen · Uhrzeiten · Donner son opinion')
d.box('Lieber kurze Runden an mehreren Tagen als alles kurz vor dem Test. Antworten Sie zuerst aus dem Kopf. Nutzen Sie danach die Rückmeldung für den nächsten Versuch.')
d.h('Ihre nächste Runde · ungefähr 7 Minuten')
d.table([['Zeit','Das tun Sie'],['1 min','Wählen Sie die passende Woche. Neue Verben zuerst mit Bedeutung und Beispielsatz ansehen.'],['4 min','Runde mit sechs bis zehn Aufgaben: zunächst ohne Hilfe antworten. Unsicherheit ehrlich markieren.'],['2 min','Zwei schwierige Formen erklären und nochmals aus dem Kopf sagen. Am nächsten Tag erneut abrufen.']],[65,CW-65],10)
d.h('Was zeigt mein Lernstand?');d.p('«Noch ungeübt» zeigt Lücken in der Abdeckung. «Noch unsicher» zeigt Aufgaben mit Fehlern, Hilfe oder Raten. Die Fehlerliste nennt Ihre letzte falsche Antwort und die passende Lösung. Unter «Wo passieren meine Fehler?» sehen Sie die Richtungen und Personen.',10)
d.p('«An mehreren Tagen» bedeutet mindestens drei erfolgreiche Abrufgelegenheiten an verschiedenen Tagen. Es ist keine Garantie für den Test. Hörschreiben wird separat erfasst, weil es das freie Konjugieren nicht ersetzt.',10)
d.h('Mit Papier lernen');d.p('Unter «PDF und Drucken» finden Sie vollständige Verbtabellen und ein Übungsheft mit Lösungen. Decken Sie beim Lernen die Lösungsspalten ab. Ihre aktuelle Verbauswahl und persönliche Fehlerliste können Sie ebenfalls drucken oder als PDF speichern.',10)
d.page('STANDORTBESTIMMUNG UND VIELFALT','Wählen Sie Ihren nächsten Schritt','Ein sinnvoller Wechsel: gezielt üben · selbst prüfen · wiederholen')
d.h('Wenn heute der Test wäre');d.p('30 Aufgaben ohne Hilfen: sechs Übersetzungen in jede Richtung und 18 Präsensformen. Alle 15 Verben aus Woche 43/44 und jede Person kommen vor. Rechnen Sie mit 12–15 Minuten. Lösungen erscheinen erst nach der Abgabe.',10)
d.box('Note = 1 + 5 × Punkte ÷ 30<br/>18 Punkte = 4,0 · 24 = 5,0 · 30 = 6,0<br/>Auf eine Dezimalstelle gerundet. Eine Einschätzung für diese Probe; die echte Prüfung kann anders gewichten.',size=10)
d.p('Bestätigen Sie «ohne Hilfen» nur, wenn es stimmt. Sonst werden Punkte und Lösungen, aber keine Note angezeigt. Eine begonnene Probe lässt sich auf demselben Gerät fortsetzen. Nach der Auswertung die Fehler üben und später eine neue Probe lösen.',10)
d.h('17 weitere Übungsformate im Übungsatelier')
d.table([['Thema','Möglichkeiten'],['Zahlen','Wörter ↔ Ziffern, hören, Rückgeld, Fehler verbessern, Frankreich und Schweiz.'],['Uhrzeiten','Schreiben, digital notieren, analoge Uhren, hören, früher/später, «Il est» und «à».'],['Meinungen','Reaktionen wählen, Begründungen verbinden, Sätze bauen, Sprachfehler erkennen, frei sprechen.']],[100,CW-100],10)
d.p('Soutien bietet einen leichteren Einstieg; Standard übt den Kernstoff; Avancé erweitert besonders Zeitrechnen und Sprechaufträge. Freies Sprechen wird anhand von drei Kriterien selbst eingeschätzt, nicht automatisch benotet. Zuhören und Rückfragen gelingen am besten zu zweit.',10)
d.page('FÜR DIE LEHRPERSON','Einsatz und Einordnung','Die Übungen ergänzen die aktive Unterrichtssequenz und kurze Hausaufgaben.')
d.h('Ein einfacher Lernrhythmus');d.p('Erster Tag: neue Verben kennenlernen, danach eine kurze Abrufrunde.<br/>Nächster Tag: fällige und schwierige Formen; zusätzlich sechs Zahlenaufgaben.<br/>Weiterer Tag: Personenwechsel oder Alltagssätze; sechs Uhrzeiten.<br/>Vor dem Test: eine Simulation ohne Hilfen, danach die Fehler besprechen. Nochmals an einem späteren Tag prüfen statt sofort viele Proben hintereinander zu lösen.',10)
d.h('Technische Grenzen sichtbar halten');d.p('Der Lernstand bleibt im jeweiligen Browser; er wird nicht automatisch zwischen Geräten synchronisiert oder an die Lehrperson geschickt. Löschen von Browserdaten löscht auch diesen Lernstand. Hören braucht eine französische Gerätestimme. Es gibt keine automatische Aussprachebewertung.',10)
d.h('Neue Wochen');d.p('Der dauerhafte Verbkatalog lässt sich um vollständige Verben und Wochenmengen erweitern. Bestehende IDs beibehalten. Die Testauswahl Woche 44 bleibt fest. Dynamische Druckansichten berücksichtigen neue Wochen sofort; fertige Wochen-PDFs müssen bei Änderungen neu erstellt werden.',10)
d.h('Warum dieser Aufbau?');d.p('Wiederholter Abruf und über die Zeit verteilte Übung bilden die Grundlage. Ein anfänglich richtiges Ergebnis wird deshalb nicht mit dauerhaftem Können gleichgesetzt. Die Abstände 1, 3, 7, 14, 30 Tage sind eine nachvollziehbare Planungshilfe; ihre individuelle Optimalität ist nicht belegt.',10)
d.p('Karpicke & Roediger (2008): The Critical Importance of Retrieval for Learning. Science. DOI: 10.1126/science.1152408.<br/>Karpicke & Roediger (2007): Expanding Retrieval Practice Promotes Short-Term Retention, but Equally Spaced Retrieval Enhances Long-Term Retention. DOI: 10.1037/0278-7393.33.4.704.',9,color=MUTED)
d.save()

for p in OUT.glob('*.pdf'):
 folder='verbentrainer/pdf'if p.name.startswith('Französisch Verben')else'module/woche-44/material'
 target=ROOT/'public'/folder;target.mkdir(parents=True,exist_ok=True);shutil.copy2(p,target/p.name)
print('PDFs aktualisiert:',OUT)
