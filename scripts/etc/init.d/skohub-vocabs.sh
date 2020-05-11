#! /bin/sh
#
### BEGIN INIT INFO
# Provides:          skohub-vocabs
# Should-Start:      $monit
# Required-Start:
# Required-Stop:
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: skohub-vocabs as a node server
# Description:       skohub-vocabs as a node server available via http
### END INIT INFO

# this file should be placed into /etc/init.d/
### if you copy it to init.d:
# set the home directory to your skohub-vocabs installation as an absolute path:
HOME_=$HOME
# set the owner of the process
RUN_AS_USER=lod
### END copy to init.d

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
HOME_VOCABS=$HOME_/git/skohub-vocabs/scripts/
DAEMON_START_SCRIPT=$HOME_VOCABS/start.sh
NAME=skohub-vocabs
PID_FILE=$HOME_VOCABS/$NAME.pid
DESC="skohub-vocabs as a node server"


###
# nothing to change after this line
###

if [ -s $PID_FILE ]; then
   PID=$(cat $PID_FILE)
fi
test -x $DAEMON_START_SCRIPT || exit 0


set -e

do_start()
{
   echo -n "Starting $DESC: "
   start-stop-daemon --start --quiet --chuid $RUN_AS_USER --exec $DAEMON_START_SCRIPT
   echo "$NAME is running as a node server with PID $(cat $PID_FILE)."
}

do_stop()
{
   echo -n "Stopping the PID $PID of $DESC: "
   start-stop-daemon --stop --signal TERM --oknodo --quiet --pid $PID
   rm -f $PID_FILE
   echo "$NAME is stopped and pidfile $PID_FILE is removed."
}

case "$1" in
   start)
      do_start
   ;;
   stop)
      do_stop
   ;;
   restart)
      do_stop
      case "$?" in
         0|1)
            do_start
            case "$?" in
                0)
                   echo "Restarted succesfully"
                ;;
                1|*)
                   echo "Failed to restart: old process is still or failed to running"
                   exit 1
                ;;
            esac
        ;;
        *)
           # Failed to stop
           echo "Failed to stop: old process is still or failed to running"
           exit 1
        ;;
    esac
   ;;
   status)
      if [ $PID ]; then
         if [ -d /proc/$PID ]; then
            echo "Process is running with PID $PID."
            exit 0
         else
            # No such PID_FILE, or executables don't match
            echo "Process is not running, but pidfile existed. Going to remove pidfile..."
            rm -f $PID_FILE
            exit 1
         fi
      else
         echo "Process is not running"
         exit 1
      fi
   ;;
  *)
   N=/etc/init.d/$NAME
   echo "Usage: $N {start|stop|restart|status}" >&2
   exit 1
   ;;
esac

exit 0
