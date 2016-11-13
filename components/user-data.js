module.exports = class UserData {

   constructor(pool) {
      this.pool = pool;
   }

    createTable() {
   		return new Promise(resolve => {
   			this.pool.connect((err, client, done) => {
			    if(err) {
			 	   resolve(Promise.reject(err));
		        }
		        var query = `
		        	CREATE TABLE public.users
					(
					  id serial primary key,
					  login character varying NOT NULL,
					  password character varying NOT NULL,
					  created_at date,
					  cookies integer[]
					)
		        `;
		        client.query(query, (err, result) => {
		       
		     
		           done();			
				   if(err) 
				      resolve(Promise.reject(err));		    
				    	
				   resolve();
			  
	        	});
		    })
   		})
   }


   findByName(name) {
     return new Promise(resolve => {

         this.pool.connect((err, client, done) => {
		    
		    if(err) {		   
		 	   resolve(Promise.reject(err));
	        }	    
	       
            client.query(`Select * from users Where login LIKE $1;`,[name], (err, result) => {	     
		      
	           done();
			   if(err) {	
			      resolve(Promise.reject(err));
			   }		   	    
			    	
			   resolve(result.rows[0]);
			  
	        });
		 });
       });  
   }
   findById(id) {
   		
     return new Promise(resolve => {

         this.pool.connect((err, client, done) => {
		    if(err) 		   
		 	   resolve(Promise.reject(err));
	        
            client.query(`Select * from users Where id = $1;`,[id], (err, result) => {  
		     
	           done();
			   if(err) {
			      resolve(Promise.reject(err));	
			   }		   	    
			    	
			   resolve(result.rows);
			  
	        });
		 });
       });  
   
   }
   createUser(username, password) {
   		 return new Promise(resolve => {

         this.pool.connect((err, client, done) => {
		    if(err) 		   
		 	   resolve(Promise.reject(err));
	        
            client.query(`insert into users (login, password) values ($1, $2)`,[username, password], (err, result) => {  
		     
	           done();
			   if(err) {
			      resolve(Promise.reject(err));	
			   }		   	    
			    	
			   resolve(result.rows);
			  
	        });
		 });
       }); 
   }

}