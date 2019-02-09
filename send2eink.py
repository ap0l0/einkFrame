#!/usr/bin/python
# -*- coding:utf-8 -*-

import epd7in5
import time
from PIL import Image,ImageDraw,ImageFont
import traceback
import sys

imagelocation = sys.argv[1]

try:
    epd = epd7in5.EPD()
    epd.init()
    #print("Clear Display")
    #epd.Clear(0xFF)

    print "Printing Image"
    Himage = Image.open(imagelocation)
    epd.display(epd.getbuffer(Himage))
    #time.sleep(2)

    print "Sleeping screen"
    epd.sleep()

except:
    print 'traceback.format_exc():\n%s' % traceback.format_exc()
    exit()