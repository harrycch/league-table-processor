$(document).ready(function() {
    console.log("document ready");
    onYearChange("2011-12");
});

function onYearChange(yearInput) {
    // console.log("onYearChange: "+yearInput);
    var decade = findDecadeFromInput(yearInput);

    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/footballcsv/eng-england/master/"+decade+"s/"+yearInput+"/1-premierleague.csv",
        dataType: "text",
        success: function(data) {
            var lines = processCSV(data) || [];
            processLines(lines);
        }
    });
}

function findDecadeFromInput(input) {
    var year = parseInt(input.split("-")[0] || "") || 2013;
    var decade = Math.floor(year/10)*10;
    // console.log("Decade = ", decade);
    return decade;
}

function processCSV(allText) {
    // console.log("processCSV");
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    // console.log(lines);
    return lines;
}

function processLines(lines) {
    var teams = [];

    for (var i = 0; i < lines.length; i++) {
        var match = lines[i];
        var homeTeamName = getTeamNameFromCSV(match[1]);
        var awayTeamName = getTeamNameFromCSV(match[2]);
        var result = getTeamNameFromCSV(match[3]);
        var homeScore = getHomeScoreFromResult(result);
        var awayScore = getAwayScoreFromResult(result);

        // console.log(homeTeamName+" "+homeScore+" : "+awayScore+" "+awayTeamName);
        var homeTeam = Team.searchOrCreateTeamByName(homeTeamName, teams);
        homeTeam.addMatch(homeScore, awayScore);

        var awayTeam = Team.searchOrCreateTeamByName(awayTeamName, teams);
        awayTeam.addMatch(awayScore, homeScore);
    }

    Team.sortTeams(teams);
    
    var table = $('#original-table');
    renderTeams(teams, table);
}

function getTeamNameFromCSV(teamNameFromCSV) {
    return teamNameFromCSV.split(":")[1] || teamNameFromCSV;
}

function getResultFromCSV(resultFromCSV) {
    return resultFromCSV.split(":")[2] || resultFromCSV;
}

function getScoreFromResult(team, result) {
    if (team == "Home") {
        return parseInt(result.split("-")[0]) || 0;
    }else if (team == "Away") {
        return parseInt(result.split("-")[1]) || 0;
    } else {
        return NaN;
    }
}

function getHomeScoreFromResult(result) {
    return getScoreFromResult("Home", result);
}

function getAwayScoreFromResult(result) {
    return getScoreFromResult("Away", result);
}

function renderTeams(teams, table) {
    var tbody = table.find("tbody");
    var tr = tbody.find('tr')[0];

    for (var i = 0; i < teams.length; i++) {
        var position = i+1;
        var team = teams[i];
        var newTr = $(tr).clone();
        newTr.find(".team-position").text(position);
        newTr.find(".team-name").text(team.name);
        newTr.find(".team-W").text(team.W);
        newTr.find(".team-D").text(team.D);
        newTr.find(".team-L").text(team.L);
        newTr.find(".team-GS").text(team.GS);
        newTr.find(".team-GC").text(team.GC);
        newTr.find(".team-GD").text(team.GD);
        newTr.find(".team-P").text(team.P);
        newTr.appendTo(tbody);
    }

    tr.remove();
}