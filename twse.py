import sys
import requests
import urllib
from bs4 import BeautifulSoup
import json

DICT_MAPS = {
    # 'Key': a list of sub-keys
    'BASIC': ['basic_info', 'type_A'],
    'DIVIDEND': ['dividend_distr', 'type_B'],
    'FINANCIAL ANALYSIS': ['financial_analysis', 'type_C'],
    'INCOME STATEMENT': ['income_statement_q', 'type_D'],
    'PE RATIO': ['basic_info', 'type_A'],
    'YEARLY EPS GRAPH': ['quarterly_eps', 'type_D'],
    'YEARLY REVENUE GRAPH': ['yearly_revenue', 'type_E'],
    # Test
    'PROFIT ANALYSIS': ['profit_analysis', 'type_D'],
    'OPEX': ['opex', 'type_D'],
    'YEARLY REVENUE': ['revenue', 'type_E'],
}

def inquiry_web(key):
    web_page = {
        'basic_info': 'http://mops.twse.com.tw/mops/web/ajax_t05st03',
        'dividend_distr': 'http://mops.twse.com.tw/mops/web/ajax_t05st09',
        'financial_analysis': 'http://mops.twse.com.tw/mops/web/ajax_t05st22',
        'income_statement_q': 'http://mops.twse.com.tw/mops/web/ajax_t163sb15',
        'quarterly_eps': 'http://mops.twse.com.tw/mops/web/ajax_t163sb15',
        'yearly_revenue': 'http://mops.twse.com.tw/mops/web/ajax_t164sb04',
        'profit_analysis': 'http://mops.twse.com.tw/mops/web/ajax_t163sb08',
        'opex': 'http://mops.twse.com.tw/mops/web/ajax_t163sb09',
        'revenue': 'http://mops.twse.com.tw/mops/web/ajax_t164sb04',
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
        'type_E':
        {
            'encodeURIComponent': '1',
            'step': '1',
            'firstin': '1',
            'off': '1',
            'keyword4': '',
            'code1': '',
            'TYPEK': '',
            'checkbtn': '',
            'queryName': 'co_id',
            'inpuType': 'co_id',
            'TYPEK': 'all',
            'isnew': isnew,
            'co_id': code_name,
            'year': year,
            'season': '04',
        },
    }

    if sys.version_info >= (3,):
        return urllib.parse.urlencode(payload[key[1]])
    else:
        return urllib.urlencode(payload[key[1]])

#if __name__ == '__main__':
def get_response(opt2key, code_name='6414'):
    key_val = DICT_MAPS[opt2key]
    s = requests.Session()
    if 'isnew' in get_payload(key_val, code_name):
        # If there exists a key named isnew in payload, loop begins 2013 (the year gov starts IFRS)
        str_resp_buf = str()
        list_json_data = list()
        for each_yr in range(102, 107):
            payload = get_payload(key_val, code_name, 'false', each_yr)
            resp = s.post(inquiry_web(key_val), data=payload)
            resp.encoding = 'utf-8'
            if resp.ok:
                # Parsing EPS value to make a bar chart
                if opt2key == "YEARLY EPS GRAPH":
                    dict_yr_eps = dict()
                    dict_yr_eps['year'] = str(each_yr + 1911)
                    (str_tmp, dict_yr_eps["eps"]) = get_eps(resp)
                    str_resp_buf = str_resp_buf + str_tmp
                    list_json_data.append(dict_yr_eps)
                # Parsing yearly revenue to make a stacked bar chart
                elif opt2key == "YEARLY REVENUE GRAPH":
                    dict_yr_rev = dict()
                    dict_yr_rev['year'] = str(each_yr + 1911)
                    (str_tmp, dict_yr_rev['revenue'], dict_yr_rev['key_order']) = get_yr_revenue(resp)
                    str_resp_buf = str_resp_buf + str_tmp
                    list_json_data.append(dict_yr_rev)
                else:
                    str_resp_buf = str_resp_buf + resp.text
        ## <TODO>: To remove DEBUG code
        print(list_json_data)
        # Encode list_json_data into JSON format and draw it on the web
        json_data = json.dumps(list_json_data)
        return str_resp_buf, json_data
    else:
        payload = get_payload(key_val, code_name)
        resp = s.post(inquiry_web(key_val), data=payload)
        resp.encoding = 'utf-8'
        if resp.ok:
            return resp.text, []

### Proceed parsing... ###
def get_eps(resp):
    soup = BeautifulSoup(resp.text, 'html.parser')
    trs = soup.find_all('tr')
    dict_eps = dict()
    try:
        dict_eps = {idx: each_td.get_text().strip() for idx, each_td in enumerate(trs[-1].find_all('td'), 1)}
        return ("<table>" + trs[0].get_text().strip() + trs[2].get_text().strip() + trs[-1].prettify() + "</table>"), dict_eps
    except IndexError:
        return resp.text, dict_eps

def get_yr_revenue(resp):
    soup = BeautifulSoup(resp.text, 'html.parser')
    trs = soup.find_all('tr')
    # Revenue distribution
    dict_rev_dist = dict()
    # Distribution keys
    list_keys = list()
    list_cmp_str = [u"營業收入合計", u"母公司業主（淨利／損）"]
    # List is empty?
    if len(trs):
        for each_tr in trs:
            tmp_tds = each_tr.findAll('td')
            try:
                str_cmp_key = tmp_tds[0].get_text().strip()
                if str_cmp_key in list_cmp_str:
                    if str_cmp_key == u"營業收入合計":
                        dict_rev_dist['all'] = tmp_tds[1].get_text().strip()
                        list_keys.append('all')
                    elif str_cmp_key == u"母公司業主（淨利／損）":
                        dict_rev_dist['self_np'] = tmp_tds[1].get_text().strip()
                        list_keys.insert(0, 'self_np')
            except IndexError:
                continue
        # Static indice may cause exception, i.e., 102 fiscal yr
        try:
            return ("<table>" + trs[3].prettify() + trs[4].prettify() + trs[8].prettify() + trs[37].prettify() + "</table>"), dict_rev_dist, list_keys
        except IndexError:
            return "", dict_rev_dist, list_keys
    else:
        return resp.text, dict_rev_dist, list_keys
