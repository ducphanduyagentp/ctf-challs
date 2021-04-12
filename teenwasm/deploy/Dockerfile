FROM ubuntu:20.04

RUN apt-get update && \
    apt-get -y install socat python3 ca-certificates && \
    groupadd teenwasm && \
    useradd -g teenwasm -m -d /home/teenwasm teenwasm && \
    chsh -s /bin/bash teenwasm

WORKDIR /home/teenwasm
ADD ./v8.release/ /home/teenwasm/v8.release/
RUN chown -R teenwasm:teenwasm /home/teenwasm

RUN apt-get -y install python3-pip && \
    python3 -m pip install pexpect

ADD flag.txt start.sh getfile.py /home/teenwasm/

USER teenwasm

CMD [ "/bin/bash", "start.sh" ]
