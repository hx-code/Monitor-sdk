import{createHistoryEvnent} from '../utils/pv'
import{DefaultOptons, TrackerConfig, Options}from '../types/index'
export default class Tracker{
    public data:Options
    constructor(options:Options){
           this.data = (<any>Object).assign(this.initDef(), options)
           this.installTracker()
    }

    private initDef():DefaultOptons{
        window.history['pushState'] = createHistoryEvnent('pushState')
        window.history['replaceState'] = createHistoryEvnent('replaceState')
        return <DefaultOptons>{
            sdkVersion:TrackerConfig.version,
            historyTracker:false,
            hashTracker:false,
            domTracker:false,
            jsError:false

        }
    }
    public sendTracker<T>(data: T){
        this.reportTracker(data)

    }
    
    public setUserId<T extends DefaultOptons ['uuid']>(uuid:T){
        this.data.uuid = uuid

    }
    public setEtra<T extends DefaultOptons['extra']>(extra:T){
        this.data.extra = extra

    }
    private captrueEvents <T>(mouseEventList:string[], targetKey:string, data?:T){
        mouseEventList.forEach(event=>{
            window.addEventListener(event,()=>{
                console.log('监听到了')
                this.reportTracker({
                    event,
                    targetKey,
                    data
                

                })
            })
         })

    }
    private installTracker(){
        if(this.data.historyTracker){
            this.captrueEvents(['pushState', 'replaceState', 'popstate'], 'history-pv')

        }
        if(this.data.hashTracker){
            this.captrueEvents(['hashchange'],'history-pv')
        }
        

    }
    private reportTracker <T>(data: T){
        const params = (<any>Object).assign(this.data,{time :new Date().getTime()})
        let headers = {
            type:'application/x-wwww-format-urlencoded'
        }

        let blob = new Blob([JSON.stringify(params)], headers)
        navigator.sendBeacon(this.data.requestUrl,blob)
    }
}