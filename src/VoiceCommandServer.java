import com.sun.net.httpserver.*;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
// import java.net.URI;
// import java.awt.Desktop;


public class VoiceCommandServer {
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/command", new CommandHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Voice Command Server running at http://localhost:8080");
    }

    static class CommandHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            String query = exchange.getRequestURI().getQuery();
            String response;

            if (query != null && query.startsWith("text=")) {
                String command = query.substring(5).toLowerCase();
                response = processCommand(command); // return command result
            } else {
                response = "No command received.";
            }

            exchange.sendResponseHeaders(200, response.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }

        private String processCommand(String command) {
    try {
        if (command.contains("open wikipedia")) {
            Runtime.getRuntime().exec("cmd /c start https://www.wikipedia.org");
            return "Opening wikipedia";
        }
        if (command.contains("open youtube")) {
            Runtime.getRuntime().exec("cmd /c start https://www.youtube.com");
            return "Opening YouTube";
        } 
        else if (command.contains("open google")) {
            Runtime.getRuntime().exec("cmd /c start https://www.google.com");
            return "Opening Google";
        }
        else if (command.contains("open edge")) {
            Runtime.getRuntime().exec("cmd /c start https://www.microsoft.com/edge");
            return "Opening edge";
        } 
        else if (command.contains("open calculator")) {
            Runtime.getRuntime().exec("cmd /c calc");
            return "Opening Calculator";
        }else if (command.contains("open vs code") || command.contains("open visual studio code")) {
            String vscodePath = "\"C:\\Users\\Soundarya Anmole\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe\""; // Adjust the path to your VS Code executable
            Runtime.getRuntime().exec(vscodePath);
            return "Opening Visual Studio Code";
        }
        else if (command.startsWith("search")) {
            String query = command.replace("search", "").trim().replace(" ", "+");
            Runtime.getRuntime().exec("cmd /c start https://www.google.com/search?q=" + query);
            return "Searching " + query.replace("+", " ");
        }
        else if (command.contains("close browser") || command.contains("close tab")) {
            Runtime.getRuntime().exec("taskkill /F /IM chrome.exe");
            return "Closing browser";
        } 
        else {
            return "Sorry, I did not understand the command " + command;
        }
    } catch (Exception e) {
        e.printStackTrace();
        return "Error executing command.";
    }
}


    }
}
