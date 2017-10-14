import sys
import requests
import urllib
from bs4 import BeautifulSoup

dict_maps = {
    'BASIC': 'basic_info',
    'DIVIDEND': 'dividend_distr',
    'YEARLY EPS': 'yearly_eps',
    'QUARTERLY EPS': 'quarterly_eps',
    'PE RATIO': 'basic_info',
    'NET PROFIT PLUS EPS': 'yearly_eps',
}

def inquiry_web(key):
    web_page = {
        'basic_info': 'http://mops.twse.com.tw/mops/web/ajax_t05st03',
        'dividend_distr': 'http://mops.twse.com.tw/mops/web/ajax_t05st09',
        'yearly_eps': 'http://mops.twse.com.tw/mops/web/ajax_t05st22',
        'quarterly_eps': 'http://mops.twse.com.tw/mops/web/ajax_t163sb15',
    }

    return web_page[key]

def get_payload(key, code_name):
    payload = {
        'basic_info':
        {
            'encodeURIComponent': '1',
            'step': '1',
            'firstin': '1',
            'off': '1',
            'keyword4': '',
            'code1': '',
            'TYPEK2': '',
            'checkbtn': '',
            'queryName': 'co_id',
            'inpuType': 'co_id',
            'TYPEK': 'all',
            'co_id': code_name,
        },
        'dividend_distr':
        {
            'encodeURIComponent': '1',
            'step': '1',
            'firstin': '1',
            'off': '1',
            'keyword4': '',
            'code1': '',
            'TYPEK2': '',
            'checkbtn': '',
            'queryName': 'co_id',
            'inpuType': 'co_id',
            'TYPEK': 'all',
            'isnew': 'true',
            'co_id': code_name,
            'year': '',
        },
        'yearly_eps':
        {
            'encodeURIComponent': '1',
            'run': 'Y',
            'step': '1',
            'TYPEK': 'sii',
            'year': '105',
            'isnew': 'true',
            'co_id': code_name,
            'firstin': '1',
            'off': '1',
            'ifrs': 'Y',
        },
        'quarterly_eps':
        {
            'encodeURIComponent': '1',
            'step': '1',
            'firstin': '1',
            'off': '1',
            'keyword4': '',
            'code1': '',
            'TYPEK2': '',
            'checkbtn': '',
            'queryName': 'co_id',
            't05st29_c_ifrs': 'N',
            't05st30_c_ifrs': 'N',
            'inpuType': 'co_id',
            'TYPEK': 'all',
            'isnew': 'true',
            'co_id': code_name,
            'year': '',
        },
    }

    if sys.version_info >= (3,):
        return urllib.parse.urlencode(payload[key])
    else:
        return urllib.urlencode(payload[key])

#if __name__ == '__main__':
def retreive(key, code_name=6414):
    key_val = dict_maps[key]
    s = requests.Session()
    payload = get_payload(key_val, code_name)
    resp = s.post(inquiry_web(key_val), data=payload)
    resp.encoding = 'utf-8'
    if resp.ok:
        if key == "NET PROFIT PLUS EPS":
            # Parsing EPS SUMMARY
            return get_eps(resp)
        else:
            return resp.text

# Proceed parsing...
def get_eps(resp):
    try:
        soup = BeautifulSoup(resp.text, "html.parser")
        tb = soup.find_all("table")
        tb_row = soup.find_all("tr")
        tb_head = soup.find_all("th", attrs={"class": "tblHead"})
        reorg_ctnt = tb[2].prettify() + "<table>" + tb_row[3].prettify() + tb_head[19].prettify() + tb_row[18].prettify() + tb_row[19].prettify() + "</table>"
        return reorg_ctnt
    except IndexError:
        return resp.text

