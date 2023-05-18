class Session{
    #totalTime;

    constructor( id, routeEmbedded, ip, timeStart ){
        this.id = id;
        this.routeEmbedded = routeEmbedded;
        this.ip = ip;
        this.timeStart = timeStart;
        this.lastActive = timeStart;
    }
    getId(){
        return this.id;
    }
    getRouteEmbedded(){
        return this.routeEmbedded;
    }
    getIp(){
        return this.ip;
    }
    getTimeStart(){
        return this.timeStart;
    }
    setId( id ){
        this.id = id;
    }
    setRouteEmbedded( routeEmbedded ){
        this.routeEmbedded = routeEmbedded;
    }
    setIp( ip ){
        this.ip = ip;
    }
    setTimeStart( timeStart ){
        this.timeStart = timeStart;
    }
    setTotalTime( totalTime ){
        this.totalTime = totalTime;
    }
    getTotalTime(){
        return this.totalTime;
    }
    calculateTotalTime(){
        this.totalTime = Date.now() - this.timeStart;
        return this.totalTime;
    }
    updateInfo( req ){
        this.routeEmbedded = req.originalUrl;
        this.ip = req.ip;
    }
    updateLastActive(){
        this.lastActive = Date.now();
    }
    toString(){
        return `Session: ${this.id}, ${this.routeEmbedded}, ${this.ip}, ${this.timeStart}`;
    }

}

module.exports = Session;