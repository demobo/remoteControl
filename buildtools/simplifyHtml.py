# Import libraries that are used
import commands
import time
import sys,os
import shutil
import re
from bs4 import BeautifulSoup

SUPPORT_TAGS=['script', 'link']

def init(sourceJsDir, sourceCssDir):
  """ Create archive folders for JS and CSS if they're not there yet. The archive folders are direct children of the source folders; Return two file handlers of log files for js and css respectively"""
  try:
    os.mkdir(sourceJsDir+'/.archive') 
  except:
    pass

  try:
    os.mkdir(sourceCssDir+'/.archive')
  except:
    pass

  # Create the log files in /tmp folder.  
  jsLogFile = open("/tmp/jslog", "w")
  cssLogFile = open("/tmp/csslog", "w")
  return (jsLogFile, cssLogFile)

def simplify(sjdir, scdir, shtml, tjdir, tcdir, thtml):
  """ Minify the files in dev- sections of a html if possible and put the generated files in degsinated places. """ 
  f = open(shtml)
  plainText = f.read()
  # Run BeatifulSoup over the html to generate a dom object.
  htmlSoup = BeautifulSoup(plainText)
  f.close()
  
  # Find all dev sections
  devSections=htmlSoup.find_all(re.compile('^dev-'))
  
  jsLogFile, cssLogFile = init(sjdir, scdir)
 
  #handle each dev-X section
  for section in devSections:
    tagName = section.name[4:]
    if tagName not in SUPPORT_TAGS:
      print tagName+" tag is not supported yet"
      continue

    if tagName=="script":
      handleJsSection(section, sjdir, tjdir, jsLogFile)
    elif tagName=="link":
      handleCssSection(section, scdir, tcdir, cssLogFile)
    
    section.name=tagName

  destination = open(thtml, 'w')
  destination.write(collapseDevSection(plainText))
  destination.close()

  jsLogFile.close()
  cssLogFile.close()

def collapseDevSection(plainText):
  toReturn = u''
  while True:
    startIndex = plainText.find('<dev-')
    if startIndex==-1:
      return toReturn + plainText

    deleteStart = plainText.find('>', startIndex)+1
    deleteEnd = plainText.find('</dev-', startIndex+1)
    endIndex = plainText.find('>', deleteEnd) 
    toReturn += plainText[:startIndex+1] + plainText[startIndex+5:deleteStart] + '</'+plainText[deleteEnd+6:endIndex+1]
    plainText = plainText[endIndex+1:]
  return toReturn

def handleCssSection(section, scdir, tcdir, logFile):
  print "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
  
  targetFilePath = tcdir+'/'+section['href']

  print "handling a css section, which is converted to %s" % targetFilePath
  print ""

  targetFile = open(targetFilePath, 'w')

  cssCompiler = os.path.abspath('google-closure-stylesheets/compiler.jar')

  links = section.find_all("link")

  success = True
  for link in links:
    status = handleLink(link, scdir, targetFile, logFile, cssCompiler)
    if status!=0:
      success = False
      
  print ""
  if not success:
    print "there is error or warning, please check the log at %s to make sure you know what happened" % logFile.name
  else:
    print "Success!"
  print ""
  targetFile.close()


def handleJsSection(section, sjdir, tjdir, logFile):
  print "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"

  targetFilePath = tjdir+'/'+section['src']
  print "handling a js section, which is converted to %s" % targetFilePath
  print ""

  targetFile = open(targetFilePath, 'w')

  jsCompiler=os.path.abspath('google-closure-compiler/compiler.jar')

  scripts = section.find_all("script")

  success = True
  for script in scripts:
    status = handleScript(script, sjdir, targetFile, logFile, jsCompiler)
    if status!=0:
      success = False

  print ""
  if not success:
    print "there is error or warning, please check the log at %s to make sure you know what happened" % logFile.name
  else:
    print "Success!"
  print ""
    
  targetFile.close()


def handleFullUri(uri, targetFile):
  """Download the file to temporary folder. And then write to targetFile(a file handler) if succeeded."""
  try:
    status, output = commands.getstatusoutput('curl -GET %s > /tmp/temp' % uri)
    if status==0:
      writeFileToTarget("/tmp/temp", targetFile)
    return status
  except:
    return 1

def handleLink(link, scdir, targetFile, logFile, cssCompiler):
  try:
    uri = link['href']
    if not uri:
      return

    elif isFullUri(uri):
      status = handleFullUri(uri, targetFile)
      if status!=0:
        print "error happens when trying to downlaod %s" % uri
      return status
    else: #relative uri
      filePath = scdir + '/' +uri
      archiveFile = scdir+'/.archive/'+uri.replace('/','-')
      if not isModified(archiveFile, filePath): # the file has not been modified since last time
        print "found an archived version of %s" % filePath
        return writeFileToTarget(archiveFile, targetFile)
      else:
        return handleRelativeCss(cssCompiler, filePath, archiveFile, logFile, targetFile)
  finally:
    pass #cleanup

def handleRelativeCss(cssCompiler, filePath, archiveFile, logFile, targetFile):
  status, output = commands.getstatusoutput('java -jar "%s" --allow-unrecognized-functions --allow-unrecognized-properties "%s" -o "%s"' % (cssCompiler, filePath, archiveFile))
  if status == 0:
    if output: #there is warning
      logFile.write("Warning when compiling %s\n" % filePath)
      logFile.write(output)
      print "waring when compiling %s" %filePath
    writeFileToTarget(archiveFile, targetFile)
    if output:
      return 1
  else:
    #compile fails, write the original file to temp
    logFile.write("Error when compiling %s\n" % filePath) 
    logFile.write(output)

    archiveF = open(archiveFile, 'w')
    writeFileToTarget(filePath, archiveF)
    archiveF.close()

    writeFileToTarget(filePath, targetFile)
    print "Error when compiling %s" %filePath
  return status


def isModified(archiveFilePath, filePath):
  try:
    archiveTime = os.stat(archiveFilePath).st_mtime
    fileTime = os.stat(filePath).st_mtime
    return fileTime >= archiveTime
  except:
    return True

def handleRelativeJs(jsCompiler, filePath, archiveFile, logFile, targetFile):
  status, output = commands.getstatusoutput('java -jar "%s" --js "%s" > "%s"' % (jsCompiler, filePath, archiveFile))

  if status == 0: # successfully compiled the file
    if output: # there are warnings
      logFile.write("Warning when compiling %s\n" % filePath)
      logFile.write(output)
      print "waring when compiling %s" %filePath
    writeFileToTarget(archiveFile, targetFile)
    if output:
      return 1
  else:
    #compile fails, write the original file to temp
    logFile.write("Error when compiling %s\n" % filePath) 
    logFile.write(output)

    archiveF = open(archiveFile, 'w')
    writeFileToTarget(filePath, archiveF)
    archiveF.close()

    writeFileToTarget(filePath, targetFile)
    print "error when compiling %s" % filePath
  
  return status

def handleScript(script, sjdir, targetFile, logFile, jsCompiler):
  try:
    uri = script['src'] 
    if not uri:
      return
  
    elif isFullUri(uri):
      status = handleFullUri(uri, targetFile)
      if status!=0:
        print "error happens when trying to downlaod %s" % uri
      return status
 
    else: # relative uri
      filePath=sjdir+'/'+uri
      archiveFile = sjdir+'/.archive/'+uri.replace('/','-')
      if not isModified(archiveFile, filePath): # the file has not been modified since last time
        print "found an archived version of %s" % filePath
        return writeFileToTarget(archiveFile, targetFile)
      else:
        return handleRelativeJs(jsCompiler, filePath, archiveFile, logFile, targetFile)
  finally:
    pass #cleanup

def writeFileToTarget(path, targetFileHandler):
  """ write the file(of path)'s content to targetFileHandler """
  try:
    f = open(path)
    targetFileHandler.write(f.read())
    f.close()
    return 0
  except:
    return 1

def isFullUri(uri):
  """ uri is a full uri if it begins with "http://" or "https:// or "//" """
  if uri.find('http://')==0 or uri.find('https://')==0 or uri.find('//')==0:
    return True

def main():
  # The script takes exactly 6 arguments. If it is not, print command line information and exit. 
  if len(sys.argv)!=7:
    print "simplifyHtml takes exactly 6 arguments: sourceJsDirectory, sourceCssDirectory, sourceHtml, targetJsDirectory, targetCssDirectory, targetHtml"
    sys.exit(1)
  # Convert all paths to absolute paths. 
  srcJsDir, srcCssDir, srcHtml, tarJsDir, tarCssDir, tarHtml = [os.path.abspath(x) for x in sys.argv[1:]]
  # Begin the work.
  simplify(srcJsDir, srcCssDir, srcHtml, tarJsDir, tarCssDir, tarHtml)

#Run the script.
if __name__=="__main__":
  start = time.time()
  main()
  #Print the time used for this run. 
  print "time total: %s seconds" % str(time.time()-start)

