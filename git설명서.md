main ==> 최종 branch  

git init -- git 초기화
git add . -- 전체파일  
git commit -m 'first commit'			=> 히스토리생성 첫번째커밋 멧세지    
git remote add origin 'https://github.com/'	 => 원격지 origin 생성 
git push origin main 								=> 원격지 업로드


--------------------------------------------------------------------
수정후
git add .
git commit -m 'second commit'			 => 히스토리생성
git push origin main						=> 원격지업로드 



########## 복사
git clone '~~~' foldername 
########## 동기화
git pull origin main 		=> main branch 동기화 
git push origin main


- sudo apt-get install build-essential

- sudo apt-get install curl

- curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash --

- sudo apt-get install -y nodejs

- sudo apt-get install git

- sudo apt-get install vim

- touch .gitconfig

- git config --global user.name amamov

-  git config --global user.email amamov@kakao.com

-  git config --global --list

- git clone <프로젝트>

- cd <프로젝트>

- npm i

- sudo npm i -g @nestjs/cli

- sudo npm i -g pm2

- vi .env (환경변수 붙여 넣기)

- sudo npm run start:prod
