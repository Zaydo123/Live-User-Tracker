class Sessions{
    constructor(){
        this.activeSessions = {sessions : []};
    }

    sessionExists(id){
        for(let i = 0; i < this.activeSessions.sessions.length; i++){
            if(this.activeSessions.sessions[i].id === id){
                return true;
            }
        }
        return false;
    }

    addSession(session){
        this.activeSessions.sessions.push(session);
    }

    removeSession(id){
        for(let i = 0; i < this.activeSessions.sessions.length; i++){
            if(this.activeSessions.sessions[i].id === id){
                this.activeSessions.sessions.splice(i, 1);
            }
        }
    }

    getSessions(){
        return this.activeSessions.sessions;
    }

    getSession(id){
        for(let i = 0; i < this.activeSessions.sessions.length; i++){
            if(this.activeSessions.sessions[i].id === id){
                return this.activeSessions.sessions[i];
            }
        }
    }

    getSessionsByIP(ip){
        let sessions = [];
        for(let i = 0; i < this.activeSessions.sessions.length; i++){
            if(this.activeSessions.sessions[i].ip === ip){
                sessions.push(this.activeSessions.sessions[i]);
            }
        }
        return sessions;
    }

    getSessionsByURL(url){
        let sessions = [];
        for(let i = 0; i < this.activeSessions.sessions.length; i++){
            if(this.activeSessions.sessions[i].url === url){
                sessions.push(this.activeSessions.sessions[i]).calculateTotalTime();
            }
        }
        return sessions;
    }

    countRoutes(){
        //tally up all the routes with the same routeEmbedded and sort the routes by visitors
        let routes = {};
        for(let i = 0; i < this.activeSessions.sessions.length; i++){
            if(routes[this.activeSessions.sessions[i].routeEmbedded] === undefined){
                routes[this.activeSessions.sessions[i].routeEmbedded] = 1;
            }else{
                routes[this.activeSessions.sessions[i].routeEmbedded]++;
            }
        }
        return routes;


    }

}

module.exports = Sessions;