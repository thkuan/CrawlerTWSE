import requests
import json
from bs4 import BeautifulSoup
from twse_url import TWSEUrlMap

def get_response(option, code_name='6414'):
    obj_url = TWSEUrlMap(option, code_name)
    s = requests.Session()
    if 'isnew' in obj_url.get_form_data():
        # If there exists a key named isnew in payload, loop begins 2013 (the year gov starts IFRS)
        str_resp_buf = str()
        list_json_data = list()
        for each_yr in range(102, 107):
            # Dynamically changing form data depends on year/quarter/month
            payload = TWSEUrlMap(option, code_name, 'false', each_yr).get_form_data()
            resp = s.post(obj_url.get_url(), data=payload)
            resp.encoding = 'utf-8'
            if resp.ok:
                # Parsing EPS value to make a bar chart
                if option == "YEARLY EPS GRAPH":
                    dict_yr_eps = dict()
                    dict_yr_eps['year'] = str(each_yr + 1911)
                    (str_tmp, dict_yr_eps["eps"]) = get_eps(resp)
                    str_resp_buf = str_resp_buf + str_tmp
                    list_json_data.append(dict_yr_eps)
                # Parsing yearly revenue to make a stacked bar chart
                elif option == "YEARLY REVENUE GRAPH":
                    dict_yr_rev = dict()
                    dict_yr_rev['year'] = str(each_yr + 1911)
                    (str_tmp, dict_yr_rev['revenue'], dict_yr_rev['key_order']) = get_yr_revenue(resp)
                    str_resp_buf = str_resp_buf + str_tmp
                    list_json_data.append(dict_yr_rev)
                elif option == "YEARLY SHAREHOLDINGS GRAPH":
                    dict_yr_shares = dict()
                    dict_yr_shares['year'] = str(each_yr + 1911)
                    (str_tmp, dict_yr_shares['shares']) = get_yr_shares(resp)
                    str_resp_buf = str_resp_buf + str_tmp
                    list_json_data.append(dict_yr_shares)

                else:
                    str_resp_buf = str_resp_buf + resp.text
        ## <TODO>: To remove DEBUG code
        print(list_json_data)
        # Encode list_json_data into JSON format and draw it on the web
        json_data = json.dumps(list_json_data)
        return str_resp_buf, json_data
    else:
        payload = obj_url.get_form_data()
        resp = s.post(obj_url.get_url(), data=payload)
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


def get_yr_shares(resp):
    soup = BeautifulSoup(resp.text, 'html.parser')
    trs = soup.find_all('tr')
    end_row = 0
    begin_row = 0
    begin_key = u'股東結構類別'
    end_key = u'股東人數'
    for row_idx, tr in enumerate(trs):
        row_text = tr.get_text().strip()
        if begin_key in row_text:
            begin_row = row_idx + 1
        elif end_key in row_text:
            end_row = row_idx
            break

    def extract_val(row):
        result = dict()
        tds = row.findAll('td')
        holder_name = tds[1].get_text().strip()
        holder_num = tds[2].get_text().strip()
        holder_shares = tds[3].get_text().strip()
        result[holder_name] = [holder_num, holder_shares]
        return result
    shares = list(map(extract_val, trs[begin_row : end_row]))
    return resp.text, shares
