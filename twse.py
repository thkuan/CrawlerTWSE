import sys
import requests
import urllib
from bs4 import BeautifulSoup

DICT_MAPS = {
    # 'Key': a list of sub-keys
    'BASIC': ['basic_info', 'type_A'],
    'DIVIDEND': ['dividend_distr', 'type_B'],
    'YEARLY EPS': ['yearly_eps', 'type_C'],
    'QUARTERLY EPS': ['quarterly_eps', 'type_D'],
    'PE RATIO': ['basic_info', 'type_A'],
    'NET PROFIT PLUS EPS': ['quarterly_eps', 'type_D'],#['yearly_eps', 'type_C'],
    'PROFIT ANALYSIS': ['profit_analysis', 'type_D'],
    'OPEX': ['opex', 'type_D'],
}

def inquiry_web(key):
    web_page = {
        'basic_info': 'http://mops.twse.com.tw/mops/web/ajax_t05st03',
        'dividend_distr': 'http://mops.twse.com.tw/mops/web/ajax_t05st09',
        'yearly_eps': 'http://mops.twse.com.tw/mops/web/ajax_t05st22',
        'quarterly_eps': 'http://mops.twse.com.tw/mops/web/ajax_t163sb15',
        'profit_analysis': 'http://mops.twse.com.tw/mops/web/ajax_t163sb08',
        'opex': 'http://mops.twse.com.tw/mops/web/ajax_t163sb09',
    }

    return web_page[key[0]]

def get_payload(key, code_name, isnew='true', year='105'):
    # Set 'true' or 'false' to isnew argument that enable history statistics inquery
    payload = {
        'type_A':
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
        'type_B':
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
            'isnew': isnew,
            'co_id': code_name,
            'year': year,
        },
        'type_C':
        {
            'encodeURIComponent': '1',
            'run': 'Y',
            'step': '1',
            'TYPEK': 'sii',
            'year': year,
            'isnew': isnew,
            'co_id': code_name,
            'firstin': '1',
            'off': '1',
            'ifrs': 'Y',
        },
        'type_D':
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
            'isnew': isnew,
            'co_id': code_name,
            'year': year,
        },
    }

    if sys.version_info >= (3,):
        return urllib.parse.urlencode(payload[key[1]])
    else:
        return urllib.urlencode(payload[key[1]])

#if __name__ == '__main__':
def retreive(opt2key, code_name='6414'):
    key_val = DICT_MAPS[opt2key]
    s = requests.Session()

    if 'isnew' in get_payload(key_val, code_name):
        # If there exists a key named isnew in payload, loop begins 2013 (the year gov starts IFRS)
        str_resp_buf = str()
        dict_eps = dict()
        for each_yr in range(102, 107):
            payload = get_payload(key_val, code_name, 'false', each_yr)
            resp = s.post(inquiry_web(key_val), data=payload)
            resp.encoding = 'utf-8'
            if resp.ok:
                if opt2key == "NET PROFIT PLUS EPS":
                    (str_tmp, dict_eps[each_yr + 1911]) = get_eps(resp)
                    str_resp_buf = str_resp_buf + str_tmp
                else:
                    str_resp_buf = str_resp_buf + resp.text
        #<TODO> Trasfer dict into JSON format and draw on the web by d3.js
        print(dict_eps)
        return str_resp_buf
    else:
        payload = get_payload(key_val, code_name)
        resp = s.post(inquiry_web(key_val), data=payload)
        resp.encoding = 'utf-8'
        if resp.ok:
            return resp.text
            '''
            if opt2key == "NET PROFIT PLUS EPS":
                # Parsing EPS SUMMARY
                return get_eps(resp)
            else:
                return resp.text
            '''
### Proceed parsing... ###
def get_eps(resp):
    try:
        soup = BeautifulSoup(resp.text, "html.parser")
        trs = soup.find_all("tr")
        dict_eps = dict()
        for idx, each_td in enumerate(trs[-1].find_all('td'), 1):
            dict_eps[idx] = each_td.get_text().strip()
        return ("<table>" + trs[0].get_text().strip() + trs[2].get_text().strip() + trs[-1].prettify() + "</table>"), dict_eps
    except IndexError:
        return resp.text, []
'''
def get_eps(resp):
#'NET PROFIT PLUS EPS': #['yearly_eps', 'type_C'],
    try:
        soup = BeautifulSoup(resp.text, "html.parser")
        tb = soup.find_all("table")
        tb_row = soup.find_all("tr")
        tb_head = soup.find_all("th", attrs={"class": "tblHead"})
        reorg_ctnt = tb[2].prettify() + "<table>" + tb_row[3].prettify() + tb_head[19].prettify() + tb_row[18].prettify() + tb_row[19].prettify() + "</table>"
        return reorg_ctnt
    except IndexError:
        return resp.text
'''
