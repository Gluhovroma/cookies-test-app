module.exports = class CookiesData {

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
		        	CREATE TABLE public.cookies
					(
					  id serial primary key,
					  title character varying,
					  description character varying,
					  created_at date,
					  last_mod date,
					  likes integer[],
					  dislikes integer[],
					  added_user integer NOT NULL,
					  img text
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
   getCookies(offsetParam,filterParam) {
      return new Promise(resolve => {
         this.pool.connect((err, client, done) => {
		    if(err) {
		 	   resolve(Promise.reject(err));
	        }
	        
	        var order = ``;
	        switch(true) {
			    case filterParam == "1":
			        order = `ORDER BY (CASE WHEN array_length(likes, 1) > 0 THEN array_length(likes, 1) ELSE 0 END) DESC
		 			`;
			        break;
			    case filterParam == "2":
			         order = `ORDER BY (CASE WHEN array_length(dislikes, 1) > 0 THEN array_length(dislikes, 1) ELSE 0 END) DESC
		 			`;
			        break;
			    case filterParam == "3":
			    	order = `ORDER BY created_at DESC
		 			`;			       
			        break;
				default:
            		order = `ORDER BY created_at DESC
		 			`;	
        			break;
			}	                
		 	
	        var offset = 5 * offsetParam;
	        var query = `
	           Select  id, 
				       title, 
				       img,
				       description, 
				       likes,
				       dislikes,
				       created_at,
				       last_mod,
				       (Select login from users Where id=added_user)   
				from cookies ` + 
				order + 
				`limit 5
				 OFFSET $1				 
	        	`;

            client.query(query,[offset], (err, result) => {
		       
		       //call `done()` to release the client back to the pool
	           done();			
			   if(err) 
			      resolve(Promise.reject(err));		    
			    	
			   resolve(result.rows);
			  
	        });
		 });
       });          
   }

   likeCookies(userId, cookiesId) {
      return new Promise(resolve => {

         this.pool.connect((err, client, done) => {
		    if(err) 		   
		 	   resolve(Promise.reject(err));

		 	var user = "{"+userId+"}";
			
	        var query = `	        	
				update cookies
				set likes = likes || $1
				where id = $2
	        `;
	        
            client.query(query,[user,cookiesId], (err, result) => {  
		     	
	           done();
			   if(err) {
			      resolve(Promise.reject(err));	
			   }		   	    
			    	
			   resolve();
			  
	        });
		 });
       });  
   }

   dislikeCookies(userId, cookiesId) {
   	return new Promise(resolve => {

         this.pool.connect((err, client, done) => {
		    if(err) 		   
		 	   resolve(Promise.reject(err));
		 	
		 	var user = "{"+userId+"}";
	        var query = `	        	
				update cookies
				set dislikes = dislikes || $1
				where id = $2
	        `
            client.query(query,[user,cookiesId], (err, result) => {  
		     	
	           done();
			   if(err) {
			      resolve(Promise.reject(err));	
			   }		   	    
			    	
			   resolve();
			  
	        });
		 });
       });  
   }
   saveCookies(item) {
      	return new Promise(resolve => {

         this.pool.connect((err, client, done) => {
		    if(err) 		   
		 	   resolve(Promise.reject(err));		 

	        var query = `	        	
				INSERT INTO cookies (title, description, created_at, last_mod, added_user, img)
    			VALUES ($1, $2, $3, $4, $5, $6);
	        `
            client.query(query, [item.title, item.description, new Date(), new Date(), item.userId, item.img], (err, result) => {  
		     	console.log("finish");
	           done();
			   if(err) {
			      resolve(Promise.reject(err));	
			   }		   	    
			    	
			   resolve();
			  
	        });
		 });
       });  
   }
}