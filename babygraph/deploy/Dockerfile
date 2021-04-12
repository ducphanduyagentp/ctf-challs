FROM ubuntu:20.04

RUN apt-get update && \
    apt-get -y install socat && \
    groupadd babygraph && \
    useradd -g babygraph -m -d /home/babygraph babygraph && \
    chsh -s /bin/bash babygraph

WORKDIR /home/babygraph
RUN chown -R babygraph:babygraph /home/babygraph

ADD flag.txt start.sh /home/babygraph/

ADD babygraph /home/babygraph/

USER babygraph

CMD [ "/bin/bash", "start.sh" ]