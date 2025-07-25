FROM node:alpine

RUN apk add --no-cache tini git \
    && yarn global add git-http-server \
    && adduser -D -g git git

# Create necessary directories
RUN mkdir -p /var/git /home/git/.ssh && \
    chown -R git:git /var/git /home/git

USER git
WORKDIR /home/git

# Initialize a bare repository
# CHANGE HERE: 
    # REPO NAME
    # USER NAME
    # EMAIL

RUN git init --bare ssdprac-repo.git && \
    cd ssdprac-repo.git && \
    git config user.name "JOSHUA CHOO SHENG XIONG" && \
    git config user.email "2301788@SIT.singaporetech.edu.sg"


ENTRYPOINT ["tini", "--", "git-http-server", "-p", "3000", "/home/git"]