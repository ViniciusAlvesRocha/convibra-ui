import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BlockExplorerService{
    constructor(private http: HttpClient){

    }

    guessEntity(_term){
        return this.http.get('/api/v1/block_explorer/guess_entity?term='+_term);  
    }

    getStats(){
        return this.http.get('/api/v1/block_explorer/summary');  
    }

    getBlocks(_option){
        let _params = new HttpParams();
        _params = _params.append('fromBlockNumber',_option.fromBlockNumber);
        _params = _params.append('toBlockNumber',_option.toBlockNumber);
        _params = _params.append('fallbackPerPage',_option.fallbackPerPage);
        
        return this.http.get('/api/v1/block_explorer/blocks',{params:_params});  
    }

    getBlockDetails(_blockHashOrNumber){
        return this.http.get('/api/v1/block_explorer/block/'+_blockHashOrNumber);  
    }

    getTxDetails(_txHash){
        return this.http.get('/api/v1/block_explorer/tx/'+_txHash);  
    }
}