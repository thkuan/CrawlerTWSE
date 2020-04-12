import sys
import urllib

class TWSEUrlMap:
    def __init__(self, option, c_n, isnew='true', yr='106', q='1', m='1'):
        self.DICT_MAPS = {
            # 'Key': a list of sub-keys
            'BASIC': ['basic_info', 'type_A'],
            'DIVIDEND': ['dividend_distr', 'type_B'],
            'FINANCIAL ANALYSIS': ['financial_analysis', 'type_C'],
            'INCOME STATEMENT': ['income_statement_q', 'type_D'],
            'PE RATIO': ['basic_info', 'type_A'],
            'YEARLY EPS GRAPH': ['quarterly_eps', 'type_D'],
            'YEARLY REVENUE GRAPH': ['yearly_revenue', 'type_E'],
            'YEARLY SHAREHOLDINGS GRAPH': ['shareholdings', 'type_D'],
            # Test
            'PROFIT ANALYSIS': ['profit_analysis', 'type_D'],
            'OPEX': ['opex', 'type_D'],
            'YEARLY REVENUE': ['revenue', 'type_E'],
        }
        self.option = option
        self.code_name = c_n
        # Set 'true' or 'false' to isnew argument that enable history statistics inquery
        self.isnew = isnew
        self.year = yr
        self.quarter = q
        self.month = m
        self.list_key = self.DICT_MAPS[option]

    def get_url(self):
        dict_req_url = {
            'basic_info': 'https://mops.twse.com.tw/mops/web/ajax_t05st03',
            'dividend_distr': 'https://mops.twse.com.tw/mops/web/ajax_t05st09',
            'financial_analysis': 'https://mops.twse.com.tw/mops/web/ajax_t05st22',
            'income_statement_q': 'https://mops.twse.com.tw/mops/web/ajax_t163sb15',
            'quarterly_eps': 'https://mops.twse.com.tw/mops/web/ajax_t163sb15',
            'yearly_revenue': 'https://mops.twse.com.tw/mops/web/ajax_t164sb04',
            'profit_analysis': 'https://mops.twse.com.tw/mops/web/ajax_t163sb08',
            'opex': 'https://mops.twse.com.tw/mops/web/ajax_t163sb09',
            'revenue': 'https://mops.twse.com.tw/mops/web/ajax_t164sb04',
            'shareholdings': 'https://mops.twse.com.tw/mops/web/ajax_t16sn02'
        }
        return dict_req_url[self.list_key[0]]

    def get_form_data(self):
        dict_payload = {
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
                'co_id': self.code_name,
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
                'isnew': self.isnew,
                'co_id': self.code_name,
                'year': self.year,
            },
            'type_C':
            {
                'encodeURIComponent': '1',
                'run': 'Y',
                'step': '1',
                'TYPEK': 'sii',
                'year': self.year,
                'isnew': self.isnew,
                'co_id': self.code_name,
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
                'isnew': self.isnew,
                'co_id': self.code_name,
                'year': self.year,
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
                'isnew': self.isnew,
                'co_id': self.code_name,
                'year': self.year,
                'season': '04',
            },
        }

        # Use urllib to encode dict_payload into url component
        if sys.version_info >= (3,):
            return urllib.parse.urlencode(dict_payload[self.list_key[1]])
        else:
            return urllib.urlencode(dict_payload[self.list_key[1]])
