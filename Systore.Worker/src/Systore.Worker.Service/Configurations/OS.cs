using System;
using System.Collections.Generic;
using System.Text;
using System.Runtime.InteropServices;

namespace Systore.Worker.Service.Configurations
{
    public static class OS
    {
        public static bool IsWindows() =>
            RuntimeInformation.IsOSPlatform(OSPlatform.Windows);

        public static bool IsMacOS() =>
            RuntimeInformation.IsOSPlatform(OSPlatform.OSX);

        public static bool IsLinux() =>
            RuntimeInformation.IsOSPlatform(OSPlatform.Linux);
    }
}
