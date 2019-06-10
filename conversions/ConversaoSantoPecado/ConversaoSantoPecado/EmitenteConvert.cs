using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace ConversaoSantoPecado
{
    public class EmitenteConvert
    {
        private string _line = "";
        private List<string> _arquivo = new List<string>();
        private byte[] currentByte = new byte[1];

        private UTF8Encoding temp = new UTF8Encoding(true);

        private int _last_read = 1;

        private void addInLine(string text)
        {
            _line += text;
        }

        private void addLine()
        {
            _arquivo.Add(_line);
            _line = "";
        }

        private string readNext(FileStream fs)
        {
            this._last_read = fs.Read(currentByte, 0, currentByte.Length);
            return temp.GetString(currentByte);
        }

        public void ConverterArquivo(string path)
        {

            //Open the stream and read it back.
            using (FileStream fs = File.OpenRead(path))
            {
                bool insideField = true;
                bool fieldQuoted = false;
                addInLine(readNext(fs));
                string current = "";
                while (this._last_read > 0)
                {
                    current = readNext(fs);
                    if ((current == " ") && !fieldQuoted)
                    {
                        addInLine("|");
                        current = readNext(fs);
                        if (current == "\"")
                        {
                            fieldQuoted = true;
                        }
                        else
                            addInLine(current);
                    }
                    else if ((current == " ") && fieldQuoted)
                    {
                        addInLine(current);
                    }
                    else if ((current == "\"") && fieldQuoted)
                    {
                        addInLine("|");
                        fieldQuoted = false;
                        current = readNext(fs);
                        current = readNext(fs);
                        if (current == "\"")
                        {
                            fieldQuoted = true;
                        }
                        else
                            addInLine(current);

                    }
                    else if ((current == "\r") && fieldQuoted)
                    {
                        addInLine(" ");
                        current = readNext(fs);
                    }
                    else if ((current == "\r") && !fieldQuoted)
                    {
                        addLine();
                        current = readNext(fs);
                    }
                    else
                        addInLine(current);
                }
            }

            File.WriteAllLines(path + "_convert", this._arquivo.ToArray());
        }



        //1310
        //\r\n


        /*public void ConverterArquivo(string path)        {                     

            //Open the stream and read it back.
            using (FileStream fs = File.OpenRead(path))
            {
                byte[] currentByte = new byte[1];
                byte[] priorByte = new byte[1];                
                UTF8Encoding temp = new UTF8Encoding(true);
                fs.Read(currentByte, 0, currentByte.Length);
                addInLine(temp.GetString(currentByte));
                priorByte[0] = currentByte[0];
                bool insideField = true;
                bool fieldQuoted = false;
                bool lineEnded = true;

                bool dontCopyByte = false;
                while (fs.Read(currentByte, 0, currentByte.Length) > 0)
                {
                    try
                    {
                        if (((char)currentByte[0] == ' ') && insideField && !fieldQuoted)
                        {
                            addInLine(" | ");
                            insideField = false;
                            priorByte[0] = 0;
                            dontCopyByte = true;
                        }
                        else if (((char)currentByte[0] == ' ') && !insideField && !fieldQuoted)
                        {
                            insideField = true;
                        }
                        else if (((char)currentByte[0] == '"') && !insideField)
                        {
                            insideField = true;
                            fieldQuoted = true;
                        }
                        else if (((char)priorByte[0] == ' ') && insideField && !fieldQuoted)
                        {
                            addInLine("|");
                            insideField = false;
                        }
                        else if (((char)currentByte[0] == '"') && insideField)
                        {
                            addInLine("|");
                            insideField = false;
                            fieldQuoted = false;
                        }
                        else if (((char)priorByte[0] == '\r') && (currentByte[0] == '\n') && insideField)
                        {
                            addInLine(" ");
                        }
                        else if (((char)priorByte[0] == '\r') && (currentByte[0] == '\n') && !insideField)
                        {
                            addLine();
                            insideField = true;
                        }
                        else
                            addInLine(temp.GetString(currentByte));
                    }
                    finally
                    {
                        Console.Write(temp.GetString(currentByte));
                        //Console.Write(temp.GetString(priorByte));
                        if (!dontCopyByte)
                            priorByte[0] = currentByte[0];
                        else
                            dontCopyByte = false;
                    }
                }
            }
        }*/
    }
}
