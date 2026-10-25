const {chromium}=require('playwright');const {execFileSync}=require('node:child_process');const fs=require('node:fs');const path=require('node:path');const baseUrl=process.env.BASE_URL||'http://127.0.0.1:3000';
(async()=>{
 execFileSync('python',[path.join(__dirname,'theme_fixture.py')],{stdio:'inherit'});
 const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`${baseUrl}/tests/theme-fixture.html`,{waitUntil:'networkidle'});
 if(errors.length)throw Error(errors.join('\n'));
 if(await p.locator('.package-card').count()!==6)throw Error('Theme package rendering failed');
 await p.locator('.filters [data-filter=boat]').click();if(await p.locator('.package-card').count()!==1)throw Error('Theme filter failed');
 await p.locator('[data-package=boat]').click();if(!(await p.locator('#detail-dialog').evaluate(d=>d.open)))throw Error('Theme dialog failed');
 console.log('Exported XML homepage smoke PASS: cards, filter, modal, JS runtime. Blogger compiler not tested.');
 } finally{await b.close();fs.unlinkSync(path.join(__dirname,'theme-fixture.html'));}
})().catch(e=>{console.error(e);process.exit(1)});
