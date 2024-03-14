mvn -f ./backend/app/pom.xml liquibase:generateChangeLog \
  -Dliquibase.url=jdbc:postgresql://localhost:5432/viandeendirect \
  -Dliquibase.username=viandeendirect \
  -Dliquibase.password="vndndrct-db-p4ssw0rd" \
  -Dliquibase.outputChangeLogFile=changeLog.yaml