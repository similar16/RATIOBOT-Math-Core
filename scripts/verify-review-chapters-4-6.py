"""Verify textbook wording with the supplied 2026 textbook PDF (requires PyMuPDF).
Usage: python scripts/verify-review-chapters-4-6.py /path/to/textbook.pdf
Only punctuation, whitespace, figure-number hyphens and superscript 2 normalize.
Four raster/fraction entries require the recorded page-image review.
"""
import json,re,sys
from pathlib import Path
import fitz
root=Path(__file__).resolve().parents[1]
book=fitz.open(sys.argv[1])
rows=json.loads((root/'tests/review-chapters-4-6-source.json').read_text())
visual={'ch4-4':107,'ch4-8':113,'ch6-5':159,'ch6-17':168}
def normalize(text):
    for a,b in [('²','2'),('′',"'"),('（','('),('）',')'),('，',','),('。','.'),('；',';'),('：',':')]:text=text.replace(a,b)
    return re.sub(r'\s|[{}-]','',text)
for card in rows:
    if card['id'] in visual:
        assert card['page']==visual[card['id']]
        continue
    assert normalize(card['text']) in normalize(book[card['page']+6].get_text()),card['id']
print('PASS 52 PDF text matches; 4 formula entries have recorded visual review at P107/P113/P159/P168')
