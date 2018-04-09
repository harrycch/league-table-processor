$(document).ready(function() {
    // console.log("document ready");
    setupDropdown();

    $('#dropdown-year .dropdown-menu .dropdown-item').last().click();
});

function getYearsAvailable(){
    var years = [];
    var MAX = 2013;
    var NUM = 20;
    for (var i = (MAX-NUM)+1; i <= MAX ; i++) {
        var next = i+1;
        var nextStr = next.toString().substr(-2);
        var year = i.toString() + "-" + nextStr;
        years.push(year);
    }
    // console.log("years available", years.length);
    return years;
}

function setupDropdown() {
    var dropdown = $('#dropdown-year');
    var dropdownMenu = dropdown.find(".dropdown-menu");
    var dropdownItem = dropdownMenu.find(".dropdown-item");
    var years = getYearsAvailable();

    for (var i = 0; i < years.length; i++) {
        dropdownItem.clone()
            .text(years[i])
            .data("year", years[i])
            .on("click", function(e) {
                var year = $(e.target).data("year");
                // console.log("clicking", year);

                $("#dropdown-year .dropdown-toggle").text(year);
                onYearChange(year);
            })
            .appendTo(dropdownMenu);
    }
    dropdownItem.remove();
}

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
            highlightRows();
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
    var newTeams = [];

    for (var i = 0; i < lines.length; i++) {
        var match = lines[i];
        var homeTeamName = getTeamNameFromCSV(match[1]);
        var awayTeamName = getTeamNameFromCSV(match[2]);
        var result = getTeamNameFromCSV(match[3]);
        var homeScore = getHomeScoreFromResult(result);
        var awayScore = getAwayScoreFromResult(result);

        var homeTeam = Team.searchOrCreateTeamByName(homeTeamName, teams);
        var awayTeam = Team.searchOrCreateTeamByName(awayTeamName, teams);
        homeTeam.addMatch(homeScore, awayScore, awayTeam);

        var newHomeTeam = Team.searchOrCreateTeamByName(homeTeamName, newTeams);
        var newAwayTeam = Team.searchOrCreateTeamByName(awayTeamName, newTeams);
        /***** Change the addMatch function to use different types of points calculation******/
        newHomeTeam.addMatchHomeAway(homeScore, awayScore, newAwayTeam);

        // console.log("Ori: ", homeTeam.name, homeTeam.P, awayTeam.name, awayTeam.P);
        // console.log("New: ", newHomeTeam.name, newHomeTeam.P, newAwayTeam.name, newAwayTeam.P);
    }

    Team.sortTeams(teams);
    Team.sortTeams(newTeams);
    
    var table = $('#original-table');
    var newTable = $('#new-table');
    renderTeams(teams, table);
    renderTeams(newTeams, newTable);
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

    // console.log("Rendering", table.attr("id"));

    tbody.empty();

    for (var i = 0; i < teams.length; i++) {
        var position = i+1;
        var team = teams[i];
        var newTr = $(tr).clone();

        // console.log("render", team.name, team.P);

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
}

function highlightRows() {
    var tableTr = $('#original-table tr');
    var newTableTr = $('#new-table tr');

    for (var i = 0; i < tableTr.length; i++) {
        var oriTeamName = $(tableTr[i]).find('td.team-name').text() || "FOO";
        var newTeamName = $(newTableTr[i]).find('td.team-name').text() || "BAR";
        console.log('Checking for highlight: ',oriTeamName, newTeamName);
        if(oriTeamName == newTeamName){
            $(tableTr[i]).addClass('table-success');
            $(newTableTr[i]).addClass('table-success');
        }else {
            $(tableTr[i]).removeClass('table-success');
            $(newTableTr[i]).removeClass('table-success');
        }
    }
}