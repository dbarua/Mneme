'''tzinfo timezone information for Asia/Vladivostok.'''
from pytz.tzinfo import DstTzInfo
from pytz.tzinfo import memorized_datetime as d
from pytz.tzinfo import memorized_ttinfo as i

class Vladivostok(DstTzInfo):
    '''Asia/Vladivostok timezone definition. See datetime.tzinfo for details'''

    zone = 'Asia/Vladivostok'

    _utc_transition_times = [
d(1,1,1,0,0,0),
d(1922,11,14,15,12,16),
d(1930,6,20,15,0,0),
d(1981,3,31,14,0,0),
d(1981,9,30,13,0,0),
d(1982,3,31,14,0,0),
d(1982,9,30,13,0,0),
d(1983,3,31,14,0,0),
d(1983,9,30,13,0,0),
d(1984,3,31,14,0,0),
d(1984,9,29,16,0,0),
d(1985,3,30,16,0,0),
d(1985,9,28,16,0,0),
d(1986,3,29,16,0,0),
d(1986,9,27,16,0,0),
d(1987,3,28,16,0,0),
d(1987,9,26,16,0,0),
d(1988,3,26,16,0,0),
d(1988,9,24,16,0,0),
d(1989,3,25,16,0,0),
d(1989,9,23,16,0,0),
d(1990,3,24,16,0,0),
d(1990,9,29,16,0,0),
d(1991,3,30,16,0,0),
d(1991,9,28,17,0,0),
d(1992,1,18,17,0,0),
d(1992,3,28,13,0,0),
d(1992,9,26,12,0,0),
d(1993,3,27,16,0,0),
d(1993,9,25,16,0,0),
d(1994,3,26,16,0,0),
d(1994,9,24,16,0,0),
d(1995,3,25,16,0,0),
d(1995,9,23,16,0,0),
d(1996,3,30,16,0,0),
d(1996,10,26,16,0,0),
d(1997,3,29,16,0,0),
d(1997,10,25,16,0,0),
d(1998,3,28,16,0,0),
d(1998,10,24,16,0,0),
d(1999,3,27,16,0,0),
d(1999,10,30,16,0,0),
d(2000,3,25,16,0,0),
d(2000,10,28,16,0,0),
d(2001,3,24,16,0,0),
d(2001,10,27,16,0,0),
d(2002,3,30,16,0,0),
d(2002,10,26,16,0,0),
d(2003,3,29,16,0,0),
d(2003,10,25,16,0,0),
d(2004,3,27,16,0,0),
d(2004,10,30,16,0,0),
d(2005,3,26,16,0,0),
d(2005,10,29,16,0,0),
d(2006,3,25,16,0,0),
d(2006,10,28,16,0,0),
d(2007,3,24,16,0,0),
d(2007,10,27,16,0,0),
d(2008,3,29,16,0,0),
d(2008,10,25,16,0,0),
d(2009,3,28,16,0,0),
d(2009,10,24,16,0,0),
d(2010,3,27,16,0,0),
d(2010,10,30,16,0,0),
d(2011,3,26,16,0,0),
d(2011,10,29,16,0,0),
d(2012,3,24,16,0,0),
d(2012,10,27,16,0,0),
d(2013,3,30,16,0,0),
d(2013,10,26,16,0,0),
d(2014,3,29,16,0,0),
d(2014,10,25,16,0,0),
d(2015,3,28,16,0,0),
d(2015,10,24,16,0,0),
d(2016,3,26,16,0,0),
d(2016,10,29,16,0,0),
d(2017,3,25,16,0,0),
d(2017,10,28,16,0,0),
d(2018,3,24,16,0,0),
d(2018,10,27,16,0,0),
d(2019,3,30,16,0,0),
d(2019,10,26,16,0,0),
d(2020,3,28,16,0,0),
d(2020,10,24,16,0,0),
d(2021,3,27,16,0,0),
d(2021,10,30,16,0,0),
d(2022,3,26,16,0,0),
d(2022,10,29,16,0,0),
d(2023,3,25,16,0,0),
d(2023,10,28,16,0,0),
d(2024,3,30,16,0,0),
d(2024,10,26,16,0,0),
d(2025,3,29,16,0,0),
d(2025,10,25,16,0,0),
d(2026,3,28,16,0,0),
d(2026,10,24,16,0,0),
d(2027,3,27,16,0,0),
d(2027,10,30,16,0,0),
d(2028,3,25,16,0,0),
d(2028,10,28,16,0,0),
d(2029,3,24,16,0,0),
d(2029,10,27,16,0,0),
d(2030,3,30,16,0,0),
d(2030,10,26,16,0,0),
d(2031,3,29,16,0,0),
d(2031,10,25,16,0,0),
d(2032,3,27,16,0,0),
d(2032,10,30,16,0,0),
d(2033,3,26,16,0,0),
d(2033,10,29,16,0,0),
d(2034,3,25,16,0,0),
d(2034,10,28,16,0,0),
d(2035,3,24,16,0,0),
d(2035,10,27,16,0,0),
d(2036,3,29,16,0,0),
d(2036,10,25,16,0,0),
d(2037,3,28,16,0,0),
d(2037,10,24,16,0,0),
        ]

    _transition_info = [
i(31680,0,'LMT'),
i(32400,0,'VLAT'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(36000,0,'VLASST'),
i(32400,0,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
i(39600,3600,'VLAST'),
i(36000,0,'VLAT'),
        ]

Vladivostok = Vladivostok()

