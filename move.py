import os
import shutil

from distutils.dir_util import copy_tree
start_css = ".\\build\\static\\css"
start_js = ".\\build\\static\\js"
start_media = ".\\build\\static\\media"
start_html = ".\\build\\index.html"


end_css = "C:\\Users\\winkl\\Desktop\\Codebase\\Web\\teams\\not_fked_up\\BackloopContacts\\api-server\\public\\static\\css"
end_js = "C:\\Users\\winkl\\Desktop\\Codebase\\Web\\teams\\not_fked_up\\BackloopContacts\\api-server\\public\\static\\js"
end_media = "C:\\Users\\winkl\\Desktop\\Codebase\\Web\\teams\\not_fked_up\\BackloopContacts\\api-server\\public\\static\\media"
end_html = "C:\\Users\\winkl\\Desktop\\Codebase\\Web\\teams\\not_fked_up\\BackloopContacts\\api-server\\public\\index.html"


def rm_end(end):
    folder = end
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))


def rm_start(start):
    folder = start
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))


end = 'C:\\Users\\winkl\\Desktop\\Codebase\\Web\\h-farm\\backend\\static\\'
start = ".\\build"
rm_end(end)

copy_tree(start, end)
rm_start(start)
