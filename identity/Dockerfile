FROM registry.access.redhat.com/ubi9 AS ubi-micro-build
RUN mkdir -p /mnt/rootfs
RUN dnf install --installroot /mnt/rootfs curl --releasever 9 --setopt install_weak_deps=false --nodocs -y; dnf --installroot /mnt/rootfs clean all

FROM quay.io/keycloak/keycloak:21.0.1
COPY --from=ubi-micro-build /mnt/rootfs /
COPY ./identity/themes /opt/keycloak/themes
COPY ./identity/realm /opt/keycloak/realm

RUN sh /opt/keycloak/bin/kc.sh build