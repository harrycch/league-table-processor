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

	addMatch(MGS, MGC) {
		if (MGS > MGC) {
			this._W = this._W + 1;
			this._P = this._P + 3;
		} else if (MGS < MGC) {
			this._L = this._L + 1;
		} else {
			this._D = this._D + 1;
			this._P = this._P + 1;
		}

		this._GS = this._GS + MGS;
		this._GC = this._GC + MGC;
	}
}