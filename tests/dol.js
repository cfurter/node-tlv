/**
 * Created by coolbong on 2016-05-30.
 */
var assert = require('assert');
var TLV = require('../lib/TLV');
var DOL = TLV.DOL;

exports.dol = {
    'example' : function() {
        var dol = DOL.parse('9F5C089F4005');

        var count = dol.count(); // 2
        assert (count == 2);

        var pDolRelatedData = '';
        dol.list.forEach(function(tl) {
            var tag = tl.getTag();
            var len = tl.getLength();
            var value = Buffer.alloc(len);
            if (tag == '9F5C') {
                value.fill(0x00);
            } else if (tag == '9F40') {
                value[0] = 0x11;
                value[1] = 0x22;
                value[2] = 0x33;
                value[3] = 0x44;
                value[4] = 0x55;
            } else {
                value.fill(0x00);
            }

            pDolRelatedData += value.toString('hex');
        });

        assert(pDolRelatedData == '00000000000000001122334455');

    },
    'DOL.parse()' : function () {
        var cdol1 = '9F02069F03069F1A0295055F2A029A039C019F37049F35019F45029F4C089F34039F21039F7C14';
        var dol = DOL.parse(cdol1);
        //dol.print();
        dol.getList();
    },
    'getDolRelatedDataLength()' :function() {
        var dol = DOL.parse('9F5C089F4005');

        assert(dol.getDolRelatedDataLength() === 13);
    },
    'size()' : function() {
        var cdol1 = '9F02069F03069F1A0295055F2A029A039C019F37049F35019F45029F4C089F34039F21039F7C14';
        var dol = DOL.parse(cdol1);
        assert(dol.count() == 14);
    },
    'toTlv()' : function() {
        var tlv;
        var dol = DOL.parse('9F5C089F4005');
        var list = dol.getList();

        tlv = list[0].toTLV('00 00 00 00 00 00 00 00');
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '9F5C');
        assert(tlv.getLength() == 8);
        assert(tlv.getValue() == '0000000000000000');

        tlv = list[1].toTLV('1122334455');
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '9F40');
        assert(tlv.getLength() == 5);
        assert(tlv.getValue() == '1122334455');
    }

};