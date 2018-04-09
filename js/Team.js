class Team{
	static searchOrCreateTeamByName(name, teams) {
		for (var i = 0; i < teams.length; i++) {
			if(teams[i].name == name){
				return teams[i];
			}
		}

		var newTeam = new Team(name);
		teams.push(newTeam);
		return newTeam;
	}

	static sortTeams(teams) {
	    teams.sort(Team.compareTeams);
	}

	static compareTeams(team1, team2) {
	    if (team1.P > team2.P)
	    	return -1;
	    if (team1.P < team2.P)
	    	return 1;
	    if (team1.GD > team2.GD)
	    	return -1
	    if (team1.GD < team2.GD)
	    	return 1
	   	if (team1.GS > team2.GS)
	    	return -1
	    if (team1.GS < team2.GS)
	    	return 1
	    return 0;
	}


	constructor(name) {
		this.name = name;
		this.P = 0;
		this.W = 0;
		this.L = 0;
		this.D = 0;
		this.GS = 0;
		this.GC = 0;
	}

	get name(){
		return this._name;
	}

	set name(name){
		this._name = name;
	}

	get W(){
		return this._W;
	}

	set W(W){
		this._W = W;
	}

	get L(){
		return this._L;
	}

	set L(L){
		this._L = L;
	}

	get D(){
		return this._D;
	}

	set D(D){
		this._D = D;
	}

	get GS(){
		return this._GS;
	}

	set GS(GS){
		this._GS = GS;
	}

	get GC(){
		return this._GC;
	}

	set GC(GC){
		this._GC = GC;
	}

	get P(){
		return this._P;
	}

	set P(P){
		this._P = P;
	}

	get GD(){
		return this._GS - this._GC;
	}

	// Current point calculation
	addMatch(MGS, MGC, opponent) {
		if (MGS > MGC) {
			this._W = this._W + 1;
			opponent.L = opponent.L +1;
			this._P = this._P + 3;
		} else if (MGS < MGC) {
			this._L = this._L + 1;
			opponent.W = opponent.W + 1;
			opponent.P = opponent.P + 3;
		} else {
			this._D = this._D + 1;
			opponent.D = opponent.D + 1;
			this._P = this._P + 1;
			opponent.P = opponent.P + 1;
		}

		this._GS = this._GS + MGS;
		this._GC = this._GC + MGC;
		opponent.GS = opponent.GS + MGC;
		opponent.GC = opponent.GC + MGS;
	}

	// Use ELO as Points
	addMatchELO(MGS, MGC, opponent) {
		var K = 60;
		var thisE = 1/(1+Math.pow(10,(this.P-opponent.P)/400));
		var oppoE = 1/(1+Math.pow(10,(opponent.P-this.P)/400));
		var thisS = 0;
		var oppoS = 0;

		if (MGS > MGC) {
			this._W = this._W + 1;
			opponent.L = opponent.L + 1;
			thisS = 1;
		} else if (MGS < MGC) {
			this._L = this._L + 1;
			opponent.W = opponent.W + 1;
			oppoS = 1;
		} else {
			this._D = this._D + 1;
			opponent.D = opponent.D + 1;
			thisS = oppoS = 0.5;
		}

		this._P = this._P + K*(thisS-thisE);
		opponent.P = opponent.P + K*(oppoS-oppoE);

		this._GS = this._GS + MGS;
		this._GC = this._GC + MGC;
		opponent.GS = opponent.GS + MGC;
		opponent.GC = opponent.GC + MGS;
	}

	// +1 for Win, -1 for Lose, 0 for draw
	addMatchPlusMinus(MGS, MGC, opponent){
		if (MGS > MGC) {
			this._W = this._W + 1;
			opponent.L = opponent.L +1;
			this._P = this._P + 1;
			opponent.P = opponent.P - 1;
		} else if (MGS < MGC) {
			this._L = this._L + 1;
			opponent.W = opponent.W + 1;
			this._P = this._P - 1;
			opponent.P = opponent.P + 1;
		} else {
			this._D = this._D + 1;
			opponent.D = opponent.D + 1;
			this._P = this._P + 0;
			opponent.P = opponent.P + 0;
		}

		this._GS = this._GS + MGS;
		this._GC = this._GC + MGC;
		opponent.GS = opponent.GS + MGC;
		opponent.GC = opponent.GC + MGS;
	}

	// +4 for Away win, +3 for Home win, +2 for away draw, +1 for home draw, 0 for lose
	addMatchHomeAway(MGS, MGC, opponent){
		if (MGS > MGC) {
			this._W = this._W + 1;
			opponent.L = opponent.L +1;
			this._P = this._P + 3;
			opponent.P = opponent.P + 0;
		} else if (MGS < MGC) {
			this._L = this._L + 1;
			opponent.W = opponent.W + 1;
			this._P = this._P + 0;
			opponent.P = opponent.P + 4;
		} else {
			this._D = this._D + 1;
			opponent.D = opponent.D + 1;
			this._P = this._P + 1;
			opponent.P = opponent.P + 2;
		}

		this._GS = this._GS + MGS;
		this._GC = this._GC + MGC;
		opponent.GS = opponent.GS + MGC;
		opponent.GC = opponent.GC + MGS;
	}
}