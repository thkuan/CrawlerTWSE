import sys
import requests
import urllib
import bs4

def inquiry_web(string):
    web_page = {
        'eps': 'http://mops.twse.com.tw/mops/web/ajax_t05st09',
        'basic_info': 'http://mops.twse.com.tw/mops/web/ajax_t05st03',
    }

    return web_page[string]

def get_payload(code_name):
    payload = {
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
    }

    if sys.version_info >= (3,):
        return urllib.parse.urlencode(payload)
    else:
        return urllib.urlencode(payload)

#if __name__ == '__main__':
def retreive(t, code_name=6414):
    translate = {
        'EPS': 'eps',
        'BASIC': 'basic_info',
    }
    s = requests.Session()
    payload = get_payload(code_name)
    resp = s.post(inquiry_web(translate[t]), data=payload)
    resp.encoding = 'utf-8'
    if resp.ok:
        return resp.text


