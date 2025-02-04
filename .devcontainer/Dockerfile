
#Run privileged build to configure container.
FROM ubuntu:latest

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN echo "root:root" | chpasswd


#Create workspace dir.
RUN mkdir -p /workspace && chmod -R 777 /workspace


# Update and install some basic tools.
RUN apt-get update && apt-get install -y \
    wget \
    git \
    build-essential \
    curl \
    unzip \
    bash \
    python3 \
    python3-pip \
    software-properties-common \
    iputils-ping \
    dnsutils \
    sudo
    

# Install SSH server
RUN apt-get update && apt-get install -y openssh-server
# Configure SSH
RUN mkdir /var/run/sshd
#password for user login
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
EXPOSE 22

RUN env | egrep -v "^(HOME=|USER=|MAIL=|LC_ALL=|LS_COLORS=|LANG=|HOSTNAME=|PWD=|TERM=|SHLVL=|LANGUAGE=|_=)" >> /etc/environment
RUN echo "if [ -f /etc/environment ]; then . /etc/environment; fi" >> /root/.bashrc
RUN echo 'PermitUserEnvironment yes' >> /etc/ssh/sshd_config


# Install ngrok
RUN curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
  && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
  | tee /etc/apt/sources.list.d/ngrok.list \
  && apt update \
  && apt install ngrok


# Create dev user.

ARG USER_UID=1000
ARG USER_GID=1000
ENV USERNAME racetrack
ENV HOME /home/$USERNAME


RUN awk -F: '$3 == 1000 {print $1}' /etc/passwd | xargs -r userdel && \
    awk -F: '$3 == 1000 {print $1}' /etc/group | xargs -r groupdel

# Create a non-root user
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && mkdir -p /etc/sudoers.d \
    && echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Set user password.
RUN echo "${USERNAME}:racetrack" | chpasswd

# Switch to non-root user.
USER ${USER_ID}:${GROUP_ID}


WORKDIR /home/$USERNAME

# Set Node.js environment variables.
RUN mkdir -p /home/$USERNAME/.nvm
ENV NVM_DIR /home/$USERNAME/.nvm

# Set exact Node.js version.
ENV NODE_VERSION 22.13.1

# Install nvm with node and npm.
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.40.1/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Set Node environment variables.
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Yarn env.
ENV YARN_HOME="/$HOME/.local/share/yarn"
ENV YARN_BIN="/$YARN_HOME/bin"
ENV PATH="${PATH}:${YARN_HOME}:${YARN_BIN}"

RUN npm install --global yarn
RUN yarn config set prefix $YARN_HOME

USER root

# Start SSH server.
CMD ["/usr/sbin/sshd", "-D"]