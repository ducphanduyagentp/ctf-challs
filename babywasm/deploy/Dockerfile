FROM ubuntu:20.04

RUN apt-get update && \
    apt-get -y install socat python3 ca-certificates && \
    groupadd babywasm && \
    useradd -g babywasm -m -d /home/babywasm babywasm && \
    chsh -s /bin/bash babywasm

WORKDIR /home/babywasm
ADD ./v8.release/ /home/babywasm/v8.release/
RUN chown -R babywasm:babywasm /home/babywasm

RUN apt-get -y install python3-pip && \
    python3 -m pip install pexpect

ADD flag.txt start.sh getfile.py /home/babywasm/

USER babywasm

CMD [ "/bin/bash", "start.sh" ]
