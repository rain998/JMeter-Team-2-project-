/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9990128331688055, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Mark Todo as Complete"], "isController": false}, {"data": [1.0, 500, 1500, "Redirect to Dashboard"], "isController": false}, {"data": [1.0, 500, 1500, "Mark Subtask as Complete"], "isController": false}, {"data": [1.0, 500, 1500, "Create Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Delete subtask"], "isController": false}, {"data": [1.0, 500, 1500, "Transaction Controller - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Get Todo Data"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Create Subtask"], "isController": false}, {"data": [1.0, 500, 1500, "Log in"], "isController": false}, {"data": [0.9875, 500, 1500, "Transaction Controller - Create Todo"], "isController": true}, {"data": [1.0, 500, 1500, "Delete Todo"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Transaction Controller - Create Subtask"], "isController": true}, {"data": [1.0, 500, 1500, "Register User"], "isController": false}, {"data": [1.0, 500, 1500, "Log in attempt"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Transaction Controller - Register"], "isController": true}, {"data": [1.0, 500, 1500, "Log out"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Transaction Controller - Edit Subtask"], "isController": true}, {"data": [1.0, 500, 1500, "Navigate to Dashboard"], "isController": false}, {"data": [0.9875, 500, 1500, "Transaction Controller - Edit Todo"], "isController": true}, {"data": [1.0, 500, 1500, "Change Todo Name"], "isController": false}, {"data": [1.0, 500, 1500, "Navigate to Login"], "isController": false}, {"data": [1.0, 500, 1500, "Redirect to Login"], "isController": false}, {"data": [1.0, 500, 1500, "Navigate to Registration"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1826, 0, 0.0, 8.400876232201517, 1, 437, 4.0, 12.0, 14.0, 123.46000000000004, 7.043992161340596, 5.868197771363433, 3.995675681735769], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Mark Todo as Complete", 17, 0, 0.0, 18.352941176470587, 9, 110, 12.0, 40.399999999999935, 110.0, 110.0, 0.17984089370345294, 0.07556044902039606, 0.11911566546420108], "isController": false}, {"data": ["Redirect to Dashboard", 100, 0, 0.0, 15.809999999999997, 1, 437, 3.0, 5.0, 8.849999999999966, 436.86999999999995, 0.5859844245339959, 1.0266172437636607, 0.38111877611293093], "isController": false}, {"data": ["Mark Subtask as Complete", 30, 0, 0.0, 18.899999999999995, 9, 142, 12.0, 35.400000000000034, 96.89999999999995, 142.0, 0.33359650390863904, 0.1322875198767917, 0.2231795360784619], "isController": false}, {"data": ["Create Todo", 128, 0, 0.0, 15.124999999999996, 8, 135, 11.0, 18.10000000000001, 23.549999999999997, 131.80999999999995, 0.6508794500068648, 0.27204727012005675, 0.423325892289621], "isController": false}, {"data": ["Delete subtask", 18, 0, 0.0, 12.277777777777779, 8, 25, 10.0, 22.300000000000004, 25.0, 25.0, 0.20002444743246398, 0.053131493849248236, 0.12464631093800353], "isController": false}, {"data": ["Transaction Controller - Login", 40, 0, 0.0, 27.475000000000005, 16, 239, 21.0, 28.9, 32.84999999999999, 239.0, 0.491805294283993, 2.9128297208697576, 1.6530709398399175], "isController": true}, {"data": ["Get Todo Data", 511, 0, 0.0, 4.354207436399225, 2, 135, 3.0, 6.0, 7.0, 10.0, 2.1025778180097516, 1.3660865140309009, 1.1833429341452877], "isController": false}, {"data": ["Logout", 120, 0, 0.0, 2.875, 1, 6, 3.0, 4.0, 4.0, 5.579999999999984, 0.5965015185934494, 0.2196104223727836, 0.36892997569256314], "isController": false}, {"data": ["Create Subtask", 99, 0, 0.0, 16.222222222222218, 9, 122, 12.0, 24.0, 28.0, 122.0, 0.4269081500646831, 0.17009621604139716, 0.28641201083441137], "isController": false}, {"data": ["Log in", 64, 0, 0.0, 16.031249999999996, 3, 382, 5.0, 7.0, 7.75, 382.0, 0.3742164842361306, 0.18930091683038638, 0.19158495298905417], "isController": false}, {"data": ["Transaction Controller - Create Todo", 40, 0, 0.0, 104.1, 29, 1036, 60.5, 182.5, 244.49999999999994, 1036.0, 0.3239810795049569, 3.128513486218655, 2.315768665359943], "isController": true}, {"data": ["Delete Todo", 14, 0, 0.0, 13.357142857142856, 9, 27, 10.5, 24.5, 27.0, 27.0, 0.1370815341381978, 0.03641228250545878, 0.08514048409364627], "isController": false}, {"data": ["Transaction Controller - Create Subtask", 30, 0, 0.0, 118.03333333333333, 28, 1012, 68.5, 219.60000000000002, 592.8999999999994, 1012.0, 0.1750935291268086, 1.6838047057845067, 1.2880488726165393], "isController": true}, {"data": ["Register User", 20, 0, 0.0, 19.449999999999996, 8, 122, 10.0, 68.50000000000011, 119.59999999999997, 122.0, 0.2567130461570057, 0.07295263323407096, 0.1408913397853879], "isController": false}, {"data": ["Log in attempt", 40, 0, 0.0, 5.225, 4, 8, 5.0, 6.0, 7.949999999999996, 8.0, 0.4979893679269948, 0.24087317767015676, 0.25682439961156833], "isController": false}, {"data": ["Login", 80, 0, 0.0, 13.075000000000001, 3, 350, 5.0, 6.900000000000006, 7.0, 350.0, 0.6498623104229792, 0.32873894218662425, 0.32620041753653445], "isController": false}, {"data": ["Transaction Controller - Register", 20, 0, 0.0, 42.65, 18, 296, 23.0, 124.70000000000022, 287.9499999999999, 296.0, 0.25513458349279244, 1.1256816877152698, 0.5065318439852022], "isController": true}, {"data": ["Log out", 60, 0, 0.0, 3.0333333333333337, 2, 17, 3.0, 4.0, 4.0, 17.0, 0.25766997629436217, 0.09486482525681107, 0.15903068849417668], "isController": false}, {"data": ["Transaction Controller - Edit Subtask", 30, 0, 0.0, 91.53333333333333, 27, 1074, 48.5, 168.70000000000013, 581.1999999999994, 1074.0, 0.3295218637756615, 2.601227571918147, 1.7230818395008842], "isController": true}, {"data": ["Navigate to Dashboard", 80, 0, 0.0, 8.862500000000004, 2, 396, 3.0, 5.0, 6.950000000000003, 396.0, 0.8003601620729328, 1.4021934870691812, 0.5213283477564904], "isController": false}, {"data": ["Transaction Controller - Edit Todo", 40, 0, 0.0, 73.425, 16, 1046, 46.0, 72.69999999999999, 142.84999999999982, 1046.0, 0.3975431831282673, 2.8272735432526983, 1.969420776476376], "isController": true}, {"data": ["Change Todo Name", 25, 0, 0.0, 13.080000000000002, 10, 33, 12.0, 16.400000000000002, 28.19999999999999, 33.0, 0.25142305448840435, 0.10484144947905144, 0.16131342460828288], "isController": false}, {"data": ["Navigate to Login", 300, 0, 0.0, 7.366666666666668, 1, 211, 3.0, 5.0, 5.0, 211.0, 1.3395308962801227, 1.8549363387941542, 0.6163063049486737], "isController": false}, {"data": ["Redirect to Login", 100, 0, 0.0, 1.7899999999999998, 1, 3, 2.0, 2.0, 3.0, 3.0, 0.4228776826302992, 0.574849349825563, 0.2133384871550904], "isController": false}, {"data": ["Navigate to Registration", 20, 0, 0.0, 4.150000000000001, 3, 6, 4.0, 5.0, 5.949999999999999, 6.0, 0.25684821554702253, 0.35216298303517535, 0.12641748108955012], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1826, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
