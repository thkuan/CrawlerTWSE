import sys
import requests
import urllib
import bs4

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
    dict_maps = {
        'BASIC': 'basic_info',
        'DIVIDEND': 'dividend_distr',
        'YEARLY EPS': 'yearly_eps',
        'QUARTERLY EPS': 'quarterly_eps',
        'PE RATIO': 'basic_info',
    }
    key_val = dict_maps[key]
    s = requests.Session()
    payload = get_payload(key_val, code_name)
    resp = s.post(inquiry_web(key_val), data=payload)
    resp.encoding = 'utf-8'
    if resp.ok:
        return resp.text


